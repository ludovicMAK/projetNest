import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlayerService } from './player.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post('/test/test/34')
  create(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playerService.create(createPlayerDto);
  }

  @Get('/test/test')
  findAll() {
    return this.playerService.findAll();
  }

  @Get('/test/:id')
  findOne(@Param('id') id: string) {
    return this.playerService.findOne(+id);
  }

  @Patch('/test/:id')
  update(@Param('id') id: string, @Body() updatePlayerDto: UpdatePlayerDto) {
    return this.playerService.update(+id, updatePlayerDto);
  }

  @Delete('/test/:id')
  remove(@Param('id') id: string) {
    return this.playerService.remove(+id);
  }
}
