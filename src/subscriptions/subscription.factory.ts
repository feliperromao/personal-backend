import { Subscription as MongoModel } from "@src/@infra/models/subscription/mongoose/subscription.model";
import { Subscription } from "./subscription.entity";


export default class SubscriptionFactory {
  static create(model: MongoModel): Subscription {
    return {
      id: model._id.toString(),
      name: model.name,
      max_students: model.max_students,
      max_exercises: model.max_exercises,
      max_training: model.max_training,
      price_brl: model.price_brl,
    }
  }
}