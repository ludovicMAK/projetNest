import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PlayerService } from '../player/player.service';
import { CreatePlayerDto } from '../player/dto/create-player.dto';
import { Player } from '../player/entities/player.entity';
import * as bcrypt from 'bcrypt';

export type AuthenticatedPlayer = Omit<Player, 'password'>;

@Injectable()
export class AuthService {
  constructor(
    private PlayerService: PlayerService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<AuthenticatedPlayer | null> {
    const user = await this.PlayerService.findOneByUsername(username);
    if (user) {
      const passwordMatch = await bcrypt.compare(pass, user.password);
      if (passwordMatch) {
        const { password: _password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(username: string, password: string) {
    const player = await this.PlayerService.findOneByUsername(username);

    if (!player) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const isPasswordValid = await bcrypt.compare(password, player.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const payload = { sub: player.id, username: player.username, role: player.role };
    const access_token = this.jwtService.sign(payload);

    return { access_token, player };
  }

  async register(createPlayerDto: CreatePlayerDto) {
    const hashedPassword = await bcrypt.hash(createPlayerDto.password, 10);

    const playerToCreate = {
      ...createPlayerDto,
      password: hashedPassword,
    };

    const createdUser = await this.PlayerService.create(playerToCreate);
    if (!createdUser) {
      return null;
    }
    return { message: 'Utilisateur créé avec succès', user: createdUser };
  }
}
