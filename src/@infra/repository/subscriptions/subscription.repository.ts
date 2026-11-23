import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Subscription } from "@src/@infra/models/subscription/mongoose/subscription.model";
import { SubscriptionDto } from "@src/subscriptions/dtos/create-subscription.dto";

@Injectable()
export class SubscriptionRepository {
  constructor(@InjectModel(Subscription.name) private model: Model<Subscription>) { }

  async findAll(): Promise<Subscription[]> {
    return await this.model.find().exec();
  }

  async findById(id: string): Promise<Subscription | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return await this.model.findById(new mongoose.Types.ObjectId(id)).exec();
  }

  async create(data: SubscriptionDto): Promise<Subscription> {
    const document = new this.model({
      _id: new ObjectId(),
      ...data,
    });
    return await document.save();
  }

  async update(id: string, data: SubscriptionDto): Promise<Subscription | null> {
    return await this.model.findByIdAndUpdate(
      new mongoose.Types.ObjectId(id),
      data,
      { new: true },
    ).exec();
  }

  async delete(id: string): Promise<Subscription | null> {
    return await this.model.findByIdAndDelete(new mongoose.Types.ObjectId(id)).exec();
  }
}
