import EncryptPassword from "./encrypt.interface";
import * as bcrypt from 'bcrypt';

export default class Bcrypt implements EncryptPassword {
  async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash)
  }

  async encrypt(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }
}