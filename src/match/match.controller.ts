import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { MatchService } from './match.service';
import { SubmitResultDto } from './dto/submit-result.dto';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @UseGuards(AdminGuard)
  @Post(':id/result')
  submitResult(@Param('id') id: string, @Body() dto: SubmitResultDto) {
    return this.matchService.submitResult(id, dto);
  }
}
