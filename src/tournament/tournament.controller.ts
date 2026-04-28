import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { JoinTournamentDto } from './dto/join-tournament.dto';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('tournaments')
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  @Get()
  findAll(@Query('status') status?: string) {
    return this.tournamentService.findAll(status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tournamentService.findOne(id);
  }

  @UseGuards(AdminGuard)
  @Post()
  create(@Body() dto: CreateTournamentDto) {
    return this.tournamentService.create(dto);
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTournamentDto) {
    return this.tournamentService.update(id, dto);
  }

  @UseGuards(AdminGuard)
  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tournamentService.remove(id);
  }

  @Post(':id/join')
  join(@Param('id') tournamentId: string, @Body() dto: JoinTournamentDto) {
    return this.tournamentService.join(tournamentId, dto.playerId);
  }

  @UseGuards(AdminGuard)
  @Post(':id/start')
  start(@Param('id') id: string) {
    return this.tournamentService.start(id);
  }

  @Get(':id/matches')
  findMatches(@Param('id') id: string) {
    return this.tournamentService.getMatches(id);
  }
}
