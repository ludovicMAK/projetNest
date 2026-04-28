import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) {}

  async findAll(): Promise<Player[]> {
    return this.playerRepository.find({
      select: ['id', 'username', 'email', 'avatar', 'createdAt'],
    });
  }

  async findOne(id: string): Promise<Player> {
    const player = await this.playerRepository.findOne({
      where: { id },
      select: ['id', 'username', 'email', 'avatar', 'createdAt'],
    });
    if (!player) {
      throw new NotFoundException(`Joueur ${id} introuvable`);
    }
    return player;
  }

  async findTournaments(id: string) {
    const player = await this.playerRepository.findOne({
      where: { id },
      relations: ['tournaments'],
    });
    if (!player) {
      throw new NotFoundException(`Joueur ${id} introuvable`);
    }
    return player;
  }

  async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const { username, email } = createPlayerDto;

    const existingUsername = await this.playerRepository.findOne({
      where: { username },
    });

    if (existingUsername) {
      throw new ConflictException('Ce nom d\'utilisateur existe déjà');
    }

    const existingEmail = await this.playerRepository.findOne({
      where: { email },
    });

    if (existingEmail) {
      throw new ConflictException('Cet email existe déjà');
    }

    const player = this.playerRepository.create(createPlayerDto);
    return this.playerRepository.save(player);
  }

  async findByEmail(email: string): Promise<Player | null> {
    return this.playerRepository.findOne({ where: { email } });
  }
  async findOneByUsername(username: string): Promise<Player | null> {
    
    return this.playerRepository.findOne({ where: { username } });
  }
  
}
