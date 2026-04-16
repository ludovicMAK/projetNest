
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PlayerService } from '../player/player.service';
import { CreatePlayerDto } from '../player/dto/create-player.dto';

@Injectable()
export class AuthService {
  constructor(
    private PlayerService: PlayerService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.PlayerService.findOneByUsernameAndPassword(username, pass);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(username: string, password: string) {
    const player = await this.validateUser(username, password);
    if (!player) {
      return null;
    }
    const payload = { username: player.username, sub: player.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async register(player: CreatePlayerDto) {
    const createdUser = await this.PlayerService.create(player);
    if (!createdUser) {
      return null;
    }
    return {
      "message": "Utilisateur créé avec succès",
      "user": {
        "id": createdUser.id,
        "username": createdUser.username,
        "email": createdUser.email
      }
    };

  }
}
