import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../@infra/models/user/mongoose/user.model';
import { UserRepository } from '../@infra/repository/user/user.repository';
import { JwtService } from '@nestjs/jwt';
import { CacheModule } from '@nestjs/cache-manager';
import { UsersService } from '@src/users/users.service';
import { StudentsController } from './students.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CacheModule.register()
  ],
  providers: [UsersService, UserRepository, JwtService],
  exports: [UsersService],
  controllers: [StudentsController]
})
export class StudentsModule {}
