import { Body, Controller, Delete, Get, Headers, Param, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@src/guards/auth.guard';
import { Roles } from '@src/guards/roles.decorator';
import { RolesGuard } from '@src/guards/roles.guard';
import { TrainingsService } from '@src/trainings/trainings.service';
import { USER_TYPE } from '@src/users/enum/user.type';
import HttpLinks from '@src/@shared/http-controls/http-links';
import SearchQueryDto from '@src/@shared/pagination/search-query.dto';
import { CreateTrainingDto } from './dtos/create-trainig.dto';

@Controller('trainings')
@Roles(USER_TYPE.PERSONAL)
@UseGuards(AuthGuard, RolesGuard)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class TrainingsController {
  constructor(protected readonly service: TrainingsService) { }

  @Get('/')
  async listAll(@Headers() headers: any, @Query() query: SearchQueryDto) {
    const { user_id } = headers
    const { search = '', student_id, page = 1, limit = 10 } = query
    return await this.service.searchTraining(user_id, search, student_id, page, limit)
  }

  @Post('/')
  async createTraining(@Headers() headers: any, @Body() body: CreateTrainingDto) {
    const { user_id } = headers
    const trainigData = { ...body, personal_id: user_id }
    const data = await this.service.create(trainigData)
    return {
      data,
      _links: HttpLinks.create('trainings', data.id)
    }
  }

  @Put('/:id')
  async updateTraining(@Headers() headers: any, @Param('id') id: string, @Body() body: CreateTrainingDto) {
    const { user_id } = headers
    const trainigData = { ...body, personal_id: user_id, id }
    return await this.service.update(trainigData)
  }

  @Delete('/:id')
  async deleteTraining(@Param('id') id: string) {
    return await this.service.delete(id)
  }

  @Get('/student/:student_id')
  async listByStudent(@Param('student_id') student_id: string) {
    return await this.service.getAllByStudent(student_id)
  }
}
