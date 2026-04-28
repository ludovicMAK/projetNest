import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards( RolesGuard)
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  findAll(): Promise<any> {
    return this.gamesService.findAll();
  }

  @Post()
  @Roles(['admin'])
  create(@Body() createGameDto: CreateGameDto): Promise<any> {
    return this.gamesService.create(createGameDto);
  }


}