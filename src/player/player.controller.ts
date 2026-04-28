import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { PlayerService } from './player.service';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get()
  findAll() {
    return this.playerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playerService.findOne(id);
  }

  @Get(':id/tournaments')
  findTournaments(@Param('id') id: string) {
    return this.playerService.findTournaments(id);
  }

  @UseGuards(AdminGuard)
  @Patch(':id/promote')
  promote(@Param('id') id: string) {
    return this.playerService.promote(id);
  }
}
