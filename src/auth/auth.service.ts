import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import Bcrypt from '@src/@infra/encrypt/bcrypt';
import EncryptPassword from '@src/@infra/encrypt/encrypt.interface';

@Injectable()
export class AuthService {
  private encrypt: EncryptPassword;
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {
    this.encrypt = new Bcrypt();
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException("invalid credentials");
    }
    if (user.blocked) {
      throw new UnauthorizedException("invalid credentials");
    }
    const compared = await this.encrypt.compare(password, user.password);
    if (!compared){
      throw new UnauthorizedException("invalid credentials");
    }
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: this.withoutPassword(user),
    };
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    password: string,
    confirmation: string,
  ): Promise<{ message: string }> {
    if (!currentPassword) {
      throw new BadRequestException('Informe a senha atual.');
    }
    if (!password || password.length < 8) {
      throw new BadRequestException('A nova senha deve ter pelo menos 8 caracteres.');
    }
    if (password !== confirmation) {
      throw new BadRequestException('As senhas não coincidem.');
    }

    const user = await this.usersService.findById(userId);
    const currentPasswordMatches = user
      ? await this.encrypt.compare(currentPassword, user.password)
      : false;
    if (!currentPasswordMatches) {
      throw new BadRequestException('A senha atual está incorreta.');
    }

    const changed = await this.usersService.changePassword(userId, password);
    if (!changed) {
      throw new BadRequestException('Não foi possível redefinir a senha.');
    }

    return { message: 'Senha redefinida com sucesso.' };
  }

  private withoutPassword(user) {
    const plainUser = typeof user?.toObject === 'function' ? user.toObject() : { ...user };
    delete plainUser.password;
    return plainUser;
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findById(userId);
    return this.withoutPassword(user);
  }
}
