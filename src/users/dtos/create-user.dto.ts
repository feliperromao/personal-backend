export class CreateUserDto {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly blocked: boolean;
  readonly personal_id: string;
}