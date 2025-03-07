import { Module } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { UsersModule} from '@src/users/users.module';
import { ExerciseRepository } from '@src/@infra/repository/exercise/exercise.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Exercise , ExerciseSchema} from '@src/@infra/models/exercise/mongoose/exercise.model';
import { ExercisesController } from '@src/controllers/exercises/exercises.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: Exercise.name, schema: ExerciseSchema }]),
  ],
  providers: [ExercisesService, ExerciseRepository, JwtService],
  controllers: [ExercisesController]
})
export class ExercisesModule {}
