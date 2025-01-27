import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Param, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Roles } from '@src/guards/roles.decorator';
import { RolesGuard } from '@src/guards/roles.guard';
import { TrainingProgressService } from '@src/training-progress/training-progress.service';
import { USER_TYPE } from '@src/users/enum/user.type';
import { StartTrainingDto } from './dtos/start-training.dto';
import { FinishTrainingDto } from './dtos/finish-training.dto';
import { AuthGuard } from '@src/guards/auth.guard';
import { TrainingsService } from '@src/trainings/trainings.service';

@Controller('training-progress')
@Roles(USER_TYPE.STUDENT)
@UseGuards(AuthGuard, RolesGuard)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class TrainingProgressController {
  constructor(
    private readonly trainingProgressService: TrainingProgressService,
    private trainingService: TrainingsService
  ) {}

  @Get('/')
  async getStudentTrainings(@Headers() headers: any) {
    const { user_id } = headers
    return await this.trainingService.getAllByStudent(user_id)
  }

  @Get('/:id')
  async showStudentTraining(@Param('id') trainingId: string) {
    return await this.trainingService.getById(trainingId)
  }

  @Get('/current')
  async getCurrentTraining(@Headers() headers: any) {
    const { user_id } = headers
    return await this.trainingProgressService.getCurrentTraining(user_id)
  }

  @Post('/start')
  @HttpCode(HttpStatus.OK)
  async startTraining(@Body() body: StartTrainingDto) {
    return await this.trainingProgressService.startTraining(body.id);
  }

  @Post('/finish')
  @HttpCode(HttpStatus.OK)
  async finishTraining(@Body() Body: FinishTrainingDto) {
    const { id, status, feedback } = Body
    return await this.trainingProgressService.finishTraining(id, status, feedback)
  }

  @Post('/calcel')
  @HttpCode(HttpStatus.OK)
  async cancelTraining(@Body() body: StartTrainingDto) {
    return await this.trainingProgressService.cancelTraining(body.id)
  }
}
