import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PersonalsController } from './personals.controller';
import { UsersModule } from '@src/users/users.module';

@Module({
  imports: [
    UsersModule,
  ],
  providers: [JwtService],
  controllers: [PersonalsController]
})
export class PersonalsModule {}
