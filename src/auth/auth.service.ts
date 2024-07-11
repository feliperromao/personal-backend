import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from './inputs/auth-credentials.input';
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

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }
    const compared = await this.encrypt.compare(password, user.password)
    if (compared){
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: AuthCredentialsDto) {
    const payload = { email: user.email, sub: user.password };
    const loginSuccess = await this.validateUser(user.email, user.password);
    if (!loginSuccess) {
      throw new Error('Invalid credentials')
    }
    console.log('loginSuccess', loginSuccess)
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
