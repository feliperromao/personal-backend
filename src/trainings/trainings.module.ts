import { Module } from '@nestjs/common';
import { TrainingsResolver } from './trainings.resolver';
import { TrainingsService } from './trainings.service';
import { UsersModule } from '@src/users/users.module';
import { TrainingSchema, Training } from '@src/@infra/models/training/mongoose/training.model';
import { MongooseModule } from '@nestjs/mongoose';
import TrainingsRepository from '@src/@infra/repository/trainings/training.repository';
import { TrainingsController } from '@src/controllers/trainings/trainings.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: Training.name, schema: TrainingSchema }]),
  ],
  providers: [TrainingsResolver, TrainingsService, TrainingsRepository, JwtService],
  controllers: [TrainingsController]
})
export class TrainingsModule {}
