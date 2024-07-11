import { User } from "./entity/user.entity";


export default class UserFactory {
  /**
   * Converte uma entidade do banco de dados em um objeto do tipo User GraphQl
   * @param data 
   * @returns User
   */
  static create(data): User {
    return {
      id: data._id.toString(),
      name: data.name,
      email: data.email,
      password: data.password,
      personal_id: data.personal_id,
      blocked: data.blocked,
      type: data.type
    }
  }
}