import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@src/guards/auth.guard';
import { Roles } from '@src/guards/roles.decorator';
import { RolesGuard } from '@src/guards/roles.guard';
import { USER_TYPE } from '@src/users/enum/user.type';
import { UsersService } from '@src/users/users.service';
import { CreatePersonalDto } from './dtos/create-personal.dto';
import { UpdatePersonalDto } from './dtos/update-personal.dto';
import HttpLinks from '@src/@shared/http-controls/http-links';

@Controller('personals')
@Roles(USER_TYPE.ADMIN)
@UseGuards(AuthGuard, RolesGuard)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class PersonalsController {
  constructor(private usersService: UsersService) { }

  private withoutPassword<T extends { password?: string }>(user: T): Omit<T, 'password'> {
    const { password: _password, ...safeUser } = user;
    return safeUser;
  }

  @Get("/")
  async listAllPersonals() {
    const personals = await this.usersService.getAllPersonals();
    return personals.map((personal) => this.withoutPassword(personal));
  }

  @Post("/")
  async createPersonal(@Body() body: CreatePersonalDto) {
    const data = await this.usersService.createPersonal(body)
    return {
      data: this.withoutPassword(data),
      _links: HttpLinks.create('personals', data.id)
    }
  }

  @Put("/:id")
  async updatePersonal(@Param('id') id: string, @Body() body: UpdatePersonalDto) {
    const userData = { ...body, id }
    const data = await this.usersService.updatePersonal(userData);
    return this.withoutPassword(data);
  }

  @Delete("/:id")
  async deletePersonal(@Param('id') id: string) {
    return await this.usersService.deleteUsers(id)
  }
}
