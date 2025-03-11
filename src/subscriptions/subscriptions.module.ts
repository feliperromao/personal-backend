import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Subscription, SubscriptionSchema } from '@src/@infra/models/subscription/mongoose/subscription.model';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionRepository } from '@src/@infra/repository/subscriptions/subscription.repository';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from '@src/users/users.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: Subscription.name, schema: SubscriptionSchema }]),
  ],
  providers: [SubscriptionsService, SubscriptionRepository, JwtService],
  controllers: [SubscriptionsController]
})
export class SubscriptionsModule { }
