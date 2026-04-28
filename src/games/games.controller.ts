import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  findAll(): Promise<any> {
    return this.gamesService.findAll();
  }

  @Post()
  create(@Body() createGameDto: CreateGameDto): Promise<any> {
    return this.gamesService.create(createGameDto);
  }


}