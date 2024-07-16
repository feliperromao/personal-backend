import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './inputs/auth-credentials.input';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => String)
  async login(@Args('authCredentialsDto') credentials: AuthCredentialsDto) {
    const dataLogin = await this.authService.login(credentials.email, credentials.password);
    return dataLogin.access_token;
  }
}
