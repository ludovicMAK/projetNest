import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './entities/game.entity';
import { CreateGameDto } from './dto/create-game.dto';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
  ) {}

  findAll(): Promise<Game[]> {
    return this.gameRepository.find();
  }

  create(dto: CreateGameDto): Promise<Game> {
    const game = this.gameRepository.create({
      ...dto,
      releaseDate: new Date(dto.releaseDate),
    });
    return this.gameRepository.save(game);
  }
}
