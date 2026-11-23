import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../@infra/models/user/mongoose/user.model';
import { UserRepository } from '../@infra/repository/user/user.repository';
import { JwtService } from '@nestjs/jwt';
import { CacheModule } from '@nestjs/cache-manager';
import { Subscription, SubscriptionSchema } from '@src/@infra/models/subscription/mongoose/subscription.model';
import { SubscriptionRepository } from '@src/@infra/repository/subscriptions/subscription.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Subscription.name, schema: SubscriptionSchema },
    ]),
    CacheModule.register()
  ],
  providers: [UsersService, UserRepository, SubscriptionRepository, JwtService],
  exports: [UsersService, UserRepository],
  controllers: []
})
export class UsersModule {}
