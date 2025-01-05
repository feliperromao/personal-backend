import { Body, Controller, Delete, Get, Headers, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ExercisesService } from '@src/exercises/exercises.service';
import { AuthGuard } from '@src/guards/auth.guard';
import { Roles } from '@src/guards/roles.decorator';
import { RolesGuard } from '@src/guards/roles.guard';
import { USER_TYPE } from '@src/users/enum/user.type';
import { CreateExerciseDto } from './dtos/create-exercise.dto';
import Paginate from '@src/@shared/pagination/paginate';
import SearchQueryDto from '@src/@shared/pagination/search-query.dto';

@Roles(USER_TYPE.PERSONAL)
@UseGuards(AuthGuard, RolesGuard)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('exercises')
export class ExercisesController {
  constructor(protected readonly service: ExercisesService) { }

  @Get('/')
  async listAll(@Headers() headers: any, @Query() query: SearchQueryDto) {
    const { user_id } = headers
    const { search = '', page=1, limit=10 } = query
    const result = await this.service.getAllByPersonal(user_id, search, page, limit)
    return Paginate.create('exercises', result.data, result.total, page, limit)
  }

  @Get('/defaults')
  async getDefaultExercises() {
    return await this.service.getDefaultExercises();
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async createExercise(@Headers() headers: any, @Body() body: CreateExerciseDto) {
    const { user_id } = headers
    const exerciseData = {
      ...body,
      personal_id: user_id
    }
    return this.service.create(exerciseData)
  }

  @Put('/:id')
  async updateExercise(@Param('id') id: string, @Headers() headers: any, @Body() body: CreateExerciseDto) {
    const { user_id } = headers
    const exerciseData = { ...body, personal_id: user_id, id: id }
    return await this.service.update(exerciseData)
  }

  @Delete('/:id')
  async deleteExercise(@Param('id') id: string) {
    return await this.service.delete([id])
  }
}
