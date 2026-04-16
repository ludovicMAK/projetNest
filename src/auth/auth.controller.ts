import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards,Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CreatePlayerDto } from '../player/dto/create-player.dto';

@Controller('auth')
export class AuthController {
   constructor(private authService: AuthService) {}
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.body.username, req.body.password);
  }
  @Public()
  @Post('register')
  async register(@Body() dto: CreatePlayerDto) {
    return this.authService.register(dto);
  }

}
