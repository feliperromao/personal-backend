import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { TrainingProgress, TrainingProgressSchema } from '@src/@infra/models/training-progress/mongoose/training-progress.model';
import TrainingProgressRepository from '@src/@infra/repository/training-progress/training-progress.repository';
import { UsersModule } from '@src/users/users.module';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: TrainingProgress.name, schema: TrainingProgressSchema }]),
  ],
  providers: [ReportsService, TrainingProgressRepository, JwtService],
  controllers: [ReportsController],
})
export class ReportsModule {}
