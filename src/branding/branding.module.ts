import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from '@src/users/users.module';
import { BrandingController } from './branding.controller';

@Module({
  imports: [UsersModule],
  providers: [JwtService],
  controllers: [BrandingController],
})
export class BrandingModule {}
