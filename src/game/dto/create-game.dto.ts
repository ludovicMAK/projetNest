import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString } from 'class-validator';

export class CreateGameDto {
  @ApiProperty({ example: 'League of Legends' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'Riot Games' })
  @IsString()
  publisher!: string;

  @ApiProperty({ example: '2009-10-27' })
  @IsDateString()
  releaseDate!: string;

  @ApiProperty({ example: 'MOBA' })
  @IsString()
  genre!: string;
}
