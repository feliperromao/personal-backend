import { USER_TYPE } from "./enum/user.type";

export default class User {
  protected _id: string;
  protected _name: string;
  protected _email: string;
  protected _password: string;
  protected _blocked: boolean;
  protected _type: USER_TYPE;
  protected _personal_id?: string;

  constructor(
    id: string,
    name: string,
    email: string,
    password: string,
    blocked: boolean,
    type: USER_TYPE,
    personal_id: string
  ) {
    this._id = id;
    this._name = name;
    this._email = email;
    this._password = password;
    this._blocked = blocked;
    this._type = type;
    this._personal_id = personal_id;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get type(): USER_TYPE {
    return this._type;
  }

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  get personal_id(): string {
    return this._password;
  }

  get blocked(): boolean {
    return this._blocked;
  }
}