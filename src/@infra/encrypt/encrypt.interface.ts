export default interface EncryptPassword {
  encrypt(password: string): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
}