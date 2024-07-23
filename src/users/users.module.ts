import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../@infra/models/user/mongoose/user.model';
import { UserRepository } from '../@infra/repository/user/user.repository';
import { UsersController } from './users.controller';
import { JwtService } from '@nestjs/jwt';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CacheModule.register()
  ],
  providers: [UsersService, UsersResolver, UserRepository, JwtService],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
