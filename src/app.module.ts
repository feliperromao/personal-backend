import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MongodbModule } from './@infra/db/mongodb/mongodb.module';
import { ExercisesModule } from './exercises/exercises.module';
import { TrainingsModule } from './trainings/trainings.module';
import { TrainingProgressModule } from './training-progress/training-progress.module';
import { AppController } from './app.controller';
import { StudentsController } from './controllers/students/students.controller';
import { JwtModule } from '@nestjs/jwt';
import { PersonalsController } from './controllers/personals/personals.controller';
import { ContentTypeMiddleware } from './middlewares/content-type.middleware';

@Module({
  imports: [
    MongodbModule,
    UsersModule,
    AuthModule,
    ExercisesModule,
    TrainingsModule,
    TrainingProgressModule,
    JwtModule
  ],
  controllers: [AppController, StudentsController, PersonalsController],
  providers: [],
})

export class AppModule{}
