import { Body, Controller, Delete, Get, Headers, HttpCode, HttpStatus, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@src/guards/auth.guard';
import { Roles } from '@src/guards/roles.decorator';
import { RolesGuard } from '@src/guards/roles.guard';
import { USER_TYPE } from '@src/users/enum/user.type';
import { UsersService } from '@src/users/users.service';
import GetStudentsDto from './dtos/get-students.dto';
import { CreateSudentDto } from './dtos/create-student.dto';
import { UpdateSudentDto } from './dtos/update-student.dto';

@Controller('students')
@Roles(USER_TYPE.PERSONAL)
@UseGuards(AuthGuard, RolesGuard)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class StudentsController {
  constructor(private usersService: UsersService) { }

  @Get("/")
  @HttpCode(HttpStatus.OK)
  async listStudents(@Headers() headers: any, @Body() body: GetStudentsDto) {
    const { user_id } = headers
    return await this.usersService.getAllByPersonal(user_id)
  }

  @Post("/")
  @HttpCode(HttpStatus.CREATED)
  async createStudent(@Headers() headers: any, @Body() body: CreateSudentDto) {
    const { user_id } = headers
    const userData = {
      ...body,
      personal_id: user_id
    }
    return await this.usersService.createStudent(userData)
  }

  @Put("/:id")
  @HttpCode(HttpStatus.OK)
  async updateStudent(@Headers() headers: any, @Param('id') id: string, @Body() body: UpdateSudentDto) {
    const { user_id } = headers
    const userData = {...body, id, personal_id: user_id }
    return await this.usersService.updateStudents(userData)
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.OK)
  async deleteStudent(@Param('id') id: string) {
    return await this.usersService.deleteUsers([id])
  }
}
