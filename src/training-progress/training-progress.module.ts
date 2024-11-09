import { Module } from '@nestjs/common';
import { TrainingProgressResolver } from './training-progress.resolver';
import { TrainingProgressService } from './training-progress.service';
import { TrainingProgress, TrainingProgressSchema } from '@src/@infra/models/training-progress/mongoose/training-progress.model';
import { UsersModule } from '@src/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import TrainingProgressRepository from '@src/@infra/repository/training-progress/training-progress.repository';
import TrainingsRepository from '@src/@infra/repository/trainings/training.repository';
import { Training, TrainingSchema } from '@src/@infra/models/training/mongoose/training.model';
import { TrainingProgressController } from '@src/controllers/training-progress/training-progress.controller';
import { JwtService } from '@nestjs/jwt';
import { TrainingsService } from '@src/trainings/trainings.service';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: TrainingProgress.name, schema: TrainingProgressSchema }]),
    MongooseModule.forFeature([{ name: Training.name, schema: TrainingSchema }]),
  ],
  providers: [TrainingProgressResolver, TrainingProgressService, TrainingProgressRepository, TrainingsRepository, TrainingsService,JwtService],
  controllers: [TrainingProgressController]
})
export class TrainingProgressModule {}
