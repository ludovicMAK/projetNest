import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { Public } from '../auth/decorators/public.decorator';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Public()
  @Get()
  findAll() {
    return this.gameService.findAll();
  }

  @UseGuards(AdminGuard)
  @Post()
  create(@Body() dto: CreateGameDto) {
    return this.gameService.create(dto);
  }
}
