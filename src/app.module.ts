import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MongodbModule } from './@infra/db/mongodb/mongodb.module';
import { ExercisesModule } from './exercises/exercises.module';
import { TrainingsModule } from './trainings/trainings.module';
import { TrainingProgressModule } from './training-progress/training-progress.module';
import { AppController } from './app.controller';
import { PersonalsModule } from './personals/personals.module';
import { JwtModule } from '@nestjs/jwt';
import { StudentsModule } from './students/students.module';

@Module({
  imports: [
    MongodbModule,
    UsersModule,
    PersonalsModule,
    StudentsModule,
    AuthModule,
    ExercisesModule,
    TrainingsModule,
    TrainingProgressModule,
    JwtModule
  ],
  controllers: [AppController],
  providers: [],
})

export class AppModule{}
