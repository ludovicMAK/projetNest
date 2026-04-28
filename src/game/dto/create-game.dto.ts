import { IsDateString, IsString } from 'class-validator';

export class CreateGameDto {
  @IsString()
  name!: string;

  @IsString()
  publisher!: string;

  @IsDateString()
  releaseDate!: string;

  @IsString()
  genre!: string;
}
