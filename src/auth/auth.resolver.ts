import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './auth.entity';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => Auth)
  async login(@Args('email') email: string, @Args('password') password: string) {
    const dataLogin = await this.authService.login(email, password);
    return {
      token: dataLogin.access_token,
      user: dataLogin.user
    };
  }
}
