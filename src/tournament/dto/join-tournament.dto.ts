import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class JoinTournamentDto {
  @ApiProperty({ example: 'uuid-du-joueur', description: 'UUID du joueur à inscrire' })
  @IsUUID()
  playerId!: string;
}
