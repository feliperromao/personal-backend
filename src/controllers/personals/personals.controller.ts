import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@src/guards/auth.guard';
import { Roles } from '@src/guards/roles.decorator';
import { RolesGuard } from '@src/guards/roles.guard';
import { USER_TYPE } from '@src/users/enum/user.type';
import { UsersService } from '@src/users/users.service';
import { CreatePersonalDto } from './dtos/create-personal.dto';
import { UpdatePersonalDto } from './dtos/update-personal.dto';

@Controller('personals')
@Roles(USER_TYPE.ADMIN)
@UseGuards(AuthGuard, RolesGuard)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class PersonalsController {
  constructor(private usersService: UsersService) { }

  @Get("/")
  async listAllPersonals() {
    return await this.usersService.getAllPersonals()
  }

  @Post("/")
  async createPersonal(@Body() body: CreatePersonalDto) {
    return await this.usersService.createPersonal(body)
  }

  @Put("/:id")
  async updatePersonal(@Param('id') id: string, @Body() body: UpdatePersonalDto) {
    const userData = {...body, id }
    return await this.usersService.updatePersonal(userData)
  }

  @Delete("/:id")
  async deletePersonal(@Param('id') id: string) {
    return await this.usersService.deleteUsers(id)
  }
}
