import { Student } from "@src/users/user.entity";
import { User as UserMongoModel } from "@src/@infra/models/user/mongoose/user.model";

export class StudentFactory {
  static create(model: UserMongoModel): Student {
    return {
      id: model._id.toString(),
      name: model.name,
      email: model.email,
      password: model.password,
      blocked: model.blocked,
      type: model.type,
      personal_id: model.personal_id ?? null,
      birthdate: model.birthdate,
      height: model.height,
      phone: model.phone,
      weight: model.weight,
      monthly_value_brl: model.monthly_value_brl
    }
  }
}