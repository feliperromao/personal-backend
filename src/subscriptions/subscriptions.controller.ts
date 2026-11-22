import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Roles } from '@src/guards/roles.decorator';
import { USER_TYPE } from '@src/users/enum/user.type';
import { AuthGuard } from '@src/guards/auth.guard';
import { RolesGuard } from '@src/guards/roles.guard';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionInput } from './inputs/create-subscription.input';


@Roles(USER_TYPE.ADMIN)
@UseGuards(AuthGuard, RolesGuard)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly service: SubscriptionsService){ }

  @Get('/')
  async listAll() {
    return this.service.findAll();
  }

  @Post('/')
  async create(@Body() body: CreateSubscriptionInput) {
    return this.service.create(body);
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() body: CreateSubscriptionInput) {
    return this.service.update(id, body);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    await this.service.delete(id);
    return { message: 'Plano excluído com sucesso.' };
  }
}
