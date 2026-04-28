import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { CreatePlayerRequest } from './request/register.request';
import { LoginPlayerRequest } from './request/login.request';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Connexion et récupération du JWT' })
  @ApiResponse({ status: 200, description: 'Connexion réussie, retourne le token JWT' })
  @ApiResponse({ status: 401, description: 'Identifiants invalides' })
  async login(@Body() body: LoginPlayerRequest) {
    return this.authService.login(body.username, body.password);
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: "Inscription d'un joueur" })
  @ApiResponse({ status: 201, description: 'Joueur créé avec succès' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 409, description: 'Username ou email déjà utilisé' })
  async register(@Body() dto: CreatePlayerRequest) {
    return this.authService.register(dto);
  }
}
