import { Body, Controller, Delete, Get, Headers, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ExercisesService } from '@src/exercises/exercises.service';
import { AuthGuard } from '@src/guards/auth.guard';
import { Roles } from '@src/guards/roles.decorator';
import { RolesGuard } from '@src/guards/roles.guard';
import { USER_TYPE } from '@src/users/enum/user.type';
import Paginate from '@src/@shared/pagination/paginate';
import SearchQueryDto from '@src/@shared/pagination/search-query.dto';
import HttpLinks from '@src/@shared/http-controls/http-links';
import { CreateExerciseInput } from './inputs/create-exercise.input';

@Roles(USER_TYPE.PERSONAL)
@UseGuards(AuthGuard, RolesGuard)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('exercises')
export class ExercisesController {
  constructor(protected readonly service: ExercisesService) { }

  @Get('/')
  async listAll(@Headers() headers: any, @Query() query: SearchQueryDto) {
    const { user_id } = headers
    const { search = '', exercise_type = '' , page = 1, limit = 10 } = query
    const result = await this.service.getAllByPersonal(user_id, search, exercise_type, page, limit)
    return Paginate.create('exercises', result.data, result.total, page, limit)
  }

  @Get('/defaults')
  async getDefaultExercises() {
    return await this.service.getDefaultExercises();
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async createExercise(@Headers() headers: any, @Body() body: CreateExerciseInput) {
    const { user_id } = headers
    const exerciseData = {
      ...body,
      personal_id: user_id
    }
    const data = await this.service.create(exerciseData)
    return {
      data,
      _links: HttpLinks.create('exercises', data.id)
    }
  }

  @Put('/:id')
  async updateExercise(@Param('id') id: string, @Headers() headers: any, @Body() body: CreateExerciseInput) {
    const { user_id } = headers
    const exerciseData = { ...body, personal_id: user_id, id: id }
    return await this.service.update(exerciseData)
  }

  @Delete('/:id')
  async deleteExercise(@Param('id') id: string) {
    return await this.service.delete(id)
  }
}
