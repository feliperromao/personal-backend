import { Module } from '@nestjs/common';
import { GraphqlModule } from './graphql.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MongodbModule } from './mongodb.module';
import { ExercisesModule } from './exercises/exercises.module';
import { TrainingsModule } from './trainings/trainings.module';
import { TrainingProgressModule } from './training-progress/training-progress.module';

@Module({
  imports: [
    MongodbModule,
    GraphqlModule,
    UsersModule,
    AuthModule,
    ExercisesModule,
    TrainingsModule,
    TrainingProgressModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
