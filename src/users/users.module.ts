import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../@infra/users/models/mongoose/user.model';
import { UserRepository } from './user.repository';
import { UsersController } from './users.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersService, UsersResolver, UserRepository, JwtService],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
