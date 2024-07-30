import { User } from "@src/users/user.entity";
import { User as UserMongoModel } from "@src/@infra/models/user/mongoose/user.model";

export default class UserFactory {
  static create(model: UserMongoModel): User {
    return {
      id: model._id.toString(),
      name: model.name,
      email: model.email,
      password: model.password,
      blocked: model.blocked,
      type: model.type,
      personal_id: model.personal_id ?? null,
    } as User
  }
}