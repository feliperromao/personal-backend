import { Module } from '@nestjs/common';
import { GraphqlModule } from './graphql.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MongodbModule } from './mongodb.module';
import { ExercisesModule } from './exercises/exercises.module';

@Module({
  imports: [
    MongodbModule,
    GraphqlModule,
    UsersModule,
    AuthModule,
    ExercisesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
