import { Body, Controller,Post,ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { CreatePlayerRequest } from './request/register.request';
import { LoginPlayerRequest } from './request/login.request';

@Controller('auth')
export class AuthController {
   constructor(private authService: AuthService) {}
  @Public()
  @Post('login')
  async login(@Body(ValidationPipe) body: LoginPlayerRequest) {
    return this.authService.login(body.username, body.password);
  }
  @Public()
  @Post('register')
  async register(@Body(ValidationPipe) dto: CreatePlayerRequest) {
    return this.authService.register(dto);
  }

}
