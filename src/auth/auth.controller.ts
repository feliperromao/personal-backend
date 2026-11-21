import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dtos/auth-credentials.dto';
import { AuthGuard } from '@src/guards/auth.guard';
import { ChangePasswordDto } from './dtos/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() loginData: AuthCredentialsDto) {
    return await this.authService.login(loginData.email, loginData.password);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post('change-password')
  async changePassword(@Request() req, @Body() data: ChangePasswordDto) {
    return this.authService.changePassword(
      req['user'].id,
      data.current_password,
      data.password,
      data.confirm_password,
    );
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return await this.authService.getProfile(req['user'].id);
  }
}
