import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Subscription } from "@src/@infra/models/subscription/mongoose/subscription.model";
import { SubscriptionDto } from "@src/subscriptions/dtos/create-subscription.dto";

@Injectable()
export class SubscriptionRepository {
  constructor(@InjectModel(Subscription.name) private model: Model<Subscription>) { }

  async findAll(): Promise<Subscription[]> {
    return await this.model.find().exec();
  }

  async create(data: SubscriptionDto): Promise<Subscription> {
    const document = new this.model({
      _id: new ObjectId(),
      ...data,
    });
    return await document.save();
  }
}