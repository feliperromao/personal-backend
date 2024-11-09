import { Body, Controller, Delete, Get, Headers, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@src/guards/auth.guard';
import { Roles } from '@src/guards/roles.decorator';
import { RolesGuard } from '@src/guards/roles.guard';
import { TrainingsService } from '@src/trainings/trainings.service';
import { USER_TYPE } from '@src/users/enum/user.type';
import { CreateTrainingDto } from './dtos/create-trainig.dto';

@Controller('trainings')
@Roles(USER_TYPE.PERSONAL)
@UseGuards(AuthGuard, RolesGuard)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class TrainingsController {
  constructor(protected readonly service: TrainingsService) { }

  @Get('/')
  async listAll(@Headers() headers: any) {
    const { user_id } = headers
    return await this.service.getAllByPersonal(user_id)
  }

  @Post('/')
  async createTraining(@Headers() headers: any, @Body() body: CreateTrainingDto) {
    const { user_id } = headers
    const trainigData = { ...body, personal_id: user_id }
    return await this.service.create(trainigData)
  }

  @Put('/:id')
  async updateTraining(@Headers() headers: any, @Param('id') id: string, @Body() body: CreateTrainingDto) {
    const { user_id } = headers
    const trainigData = { ...body, personal_id: user_id, id }
    return await this.service.update(trainigData)
  }

  @Delete('/:id')
  async deleteTraining(@Param('id') id: string) {
    return await this.service.delete([id])
  }
}
