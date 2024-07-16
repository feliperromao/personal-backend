import User from "./user.entity";

export default class UserFactory {
  static create(data): User {
    return new User(
      data._id.toString(),
      data.name,
      data.email,
      data.password,
      data.blocked,
      data.type,
      data.personal_id ?? null,
    )
  }
}