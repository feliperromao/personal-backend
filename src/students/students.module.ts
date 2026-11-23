import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from '@src/users/users.module';
import { StudentsController } from './students.controller';

@Module({
  imports: [UsersModule],
  providers: [JwtService],
  controllers: [StudentsController],
})
export class StudentsModule {}
