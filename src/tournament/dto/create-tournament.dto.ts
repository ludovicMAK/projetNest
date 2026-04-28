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

export class CreateTournamentDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsUUID()
  gameId!: string;

  @IsNumber()
  @Min(2)
  maxPlayers!: number;

  @IsDateString()
  startDate!: string;

  @IsEnum(['pending', 'in_progress', 'completed'])
  @IsOptional()
  status?: 'pending' | 'in_progress' | 'completed';
}
