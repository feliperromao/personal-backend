import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Roles } from '@src/guards/roles.decorator';
import { RolesGuard } from '@src/guards/roles.guard';
import { TrainingProgressService } from '@src/training-progress/training-progress.service';
import { USER_TYPE } from '@src/users/enum/user.type';
import { StartTrainingDto } from './dtos/start-training.dto';
import { FinishTrainingDto } from './dtos/finish-training.dto';
import { AuthGuard } from '@src/guards/auth.guard';
import { TrainingsService } from '@src/trainings/trainings.service';
import { CompleteSeriesDto } from './dtos/complete-series.dto';
import { Request } from 'express';

@Controller('training-progress')
@Roles(USER_TYPE.STUDENT, USER_TYPE.PERSONAL)
@UseGuards(AuthGuard, RolesGuard)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class TrainingProgressController {
  constructor(
    private readonly trainingProgressService: TrainingProgressService,
    private trainingService: TrainingsService
  ) {}

  @Get('/')
  async getTrainings(@Req() request: Request) {
    const user = request['user'];
    return user.type === USER_TYPE.PERSONAL
      ? await this.trainingService.getAllByPersonal(user.id)
      : await this.trainingService.getAllByStudent(user.id)
  }

  @Get('/current')
  async getCurrentTraining(@Req() request: Request) {
    return await this.trainingProgressService.getCurrentTraining(request['user'].id)
  }

  @Get('/:id')
  async showTraining(@Req() request: Request, @Param('id') trainingId: string) {
    const user = request['user'];
    return await this.trainingService.getByIdForExecutor(trainingId, user.id, user.type)
  }

  @Post('/start')
  @HttpCode(HttpStatus.OK)
  async startTraining(@Req() request: Request, @Body() body: StartTrainingDto) {
    const user = request['user'];
    return await this.trainingProgressService.startTraining(body.id, user.id, user.type);
  }

  @Post('/finish')
  @HttpCode(HttpStatus.OK)
  async finishTraining(@Req() request: Request, @Body() Body: FinishTrainingDto) {
    const { id, status, feedback } = Body
    return await this.trainingProgressService.finishTraining(id, status, request['user'].id, feedback)
  }

  @Post('/series')
  @HttpCode(HttpStatus.OK)
  async completeSeries(@Req() request: Request, @Body() body: CompleteSeriesDto) {
    const { id, exercise_id, series, load } = body;
    return await this.trainingProgressService.completeSeries(id, request['user'].id, exercise_id, series, load);
  }

  @Post(['/cancel', '/calcel'])
  @HttpCode(HttpStatus.OK)
  async cancelTraining(@Req() request: Request, @Body() body: StartTrainingDto) {
    return await this.trainingProgressService.cancelTraining(body.id, request['user'].id)
  }
}
