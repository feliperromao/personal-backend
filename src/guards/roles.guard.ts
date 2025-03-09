import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { UsersService } from '@src/users/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }


    // Obtém a requisição HTTP padrão
    const request = context.switchToHttp().getRequest();
    const { user } = request;

    if (!user) {
      return false;
    }

    const userData = await this.usersService.findById(user.id);

    return requiredRoles.some((role) => userData.type === role);
  }
}
