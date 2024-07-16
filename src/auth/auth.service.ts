import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import Bcrypt from 'src/@infra/encrypt/bcrypt';
import EncryptPassword from 'src/@infra/encrypt/encrypt.interface';

@Injectable()
export class AuthService {
  private encrypt: EncryptPassword;
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {
    this.encrypt = new Bcrypt();
  }

  async login(email: string, password: string) {
    console.log("🚀 ~ AuthService ~ login ~ email:", email)
    console.log("🚀 ~ AuthService ~ login ~ password:", password)
    const user = await this.usersService.findByEmail(email);
    console.log("🚀 ~ user found:", JSON.stringify(user))
    if (!user) {
      throw new UnauthorizedException("invalid credentials");
    }
    const compared = await this.encrypt.compare(password, user.password);
    if (!compared){
      throw new UnauthorizedException("invalid credentials");
    }
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
