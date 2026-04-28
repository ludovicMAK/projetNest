import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsOptional,
  IsEnum,
  IsUUID,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTournamentDto {
  @ApiProperty({ example: 'Tournoi Spring 2026' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'uuid-du-jeu', description: 'UUID du jeu associé' })
  @IsUUID()
  gameId!: string;

  @ApiProperty({ example: 8, minimum: 2 })
  @IsNumber()
  @Min(2)
  maxPlayers!: number;

  @ApiProperty({ example: '2026-05-01T10:00:00Z' })
  @IsDateString()
  startDate!: string;

  @ApiPropertyOptional({ enum: ['pending', 'in_progress', 'completed'], default: 'pending' })
  @IsEnum(['pending', 'in_progress', 'completed'])
  @IsOptional()
  status?: 'pending' | 'in_progress' | 'completed';
}
