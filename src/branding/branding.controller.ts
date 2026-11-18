import {
  Body,
  Controller,
  Get,
  Headers,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@src/guards/auth.guard';
import { Roles } from '@src/guards/roles.decorator';
import { RolesGuard } from '@src/guards/roles.guard';
import { USER_TYPE } from '@src/users/enum/user.type';
import { UsersService } from '@src/users/users.service';
import { UpdateBrandingDto } from './dtos/update-branding.dto';

@Controller('branding')
@UseGuards(AuthGuard, RolesGuard)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class BrandingController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  async getBranding(@Headers('user_id') userId: string) {
    return this.usersService.getBrandingForUser(userId);
  }

  @Put('/')
  @Roles(USER_TYPE.PERSONAL)
  async updateBranding(
    @Headers('user_id') userId: string,
    @Body() branding: UpdateBrandingDto,
  ) {
    return this.usersService.updateBranding(userId, branding);
  }
}
