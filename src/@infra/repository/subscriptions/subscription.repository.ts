import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Subscription } from "@src/@infra/models/subscription/mongoose/subscription.model";
import { CreateSubscriptionDto } from "@src/subscriptions/dtos/create-subscription.dto";

@Injectable()
export class SubscriptionRepository {
  constructor(@InjectModel(Subscription.name) private model: Model<Subscription>) { }

  async findAll(): Promise<Subscription[]> {
    return await this.model.find().exec();
  }

  async findById(id: string): Promise<Subscription> {
    return await this.model.findById(new mongoose.Types.ObjectId(id));
  }

  async create(data: CreateSubscriptionDto): Promise<Subscription> {
    const document = new this.model({
      _id: new ObjectId(),
      ...data,
    });
    return await document.save();
  }
}