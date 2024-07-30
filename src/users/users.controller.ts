import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreatePersonalInput } from './inputs/create-personal.input';
import { CreateStudentInput } from './inputs/create-student.input';
import { USER_TYPE } from '@src/users/enum/user.type';
import { Roles } from '@src/guards/roles.decorator';
import { RolesGuard } from '@src/guards/http-roles.guard';
import { AuthGuard } from '@src/guards/auth.guard';

@Controller('users')
export class UsersController {
  constructor(protected readonly service: UsersService){}

  @HttpCode(HttpStatus.OK)
  @Get('/students')
  @Roles(USER_TYPE.ADMIN)
  async getStudents() {
    return await this.service.findAll();
  }

  @HttpCode(HttpStatus.OK)
  @Get('/personal')
  @Roles(USER_TYPE.ADMIN)
  async getPersonals() {
    return await this.service.findAll();
  }

  @Post('/create-personal')
  @Roles(USER_TYPE.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  createPersonal(@Body() userData: CreatePersonalInput) {
    return this.service.createPersonal(userData);
  }

  @Post('/create-student')
  @Roles(USER_TYPE.PERSONAL)
  @UseGuards(AuthGuard, RolesGuard)
  createStudent(@Body() userData: CreateStudentInput) {
    return this.service.createStudent(userData);
  }
}
