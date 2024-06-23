import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './inputs/auth-credentials.input';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => String)
  async login(@Args('authCredentialsDto') authCredentialsDto: AuthCredentialsDto) {
    const dataLogin = await this.authService.login(authCredentialsDto);
    return dataLogin.access_token;
  }
}
