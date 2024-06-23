import { Module } from '@nestjs/common';
import { GraphqlModule } from './graphql.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MongodbModule } from './@infra/database/mongodb.module';

@Module({
  imports: [
    MongodbModule,
    GraphqlModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
