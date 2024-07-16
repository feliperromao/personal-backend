import User from "./user.entity";

export default interface IUserRepository {
  findByEmail(email: string): Promise<User>;
  create(user: User): Promise<User>;
  findAll(): Promise<User[]>;
}