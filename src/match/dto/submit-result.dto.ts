import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class SubmitResultDto {
  @ApiProperty({
    example: 'uuid-du-gagnant',
    description: 'UUID du joueur gagnant (player1 ou player2)',
  })
  @IsUUID()
  winnerId!: string;

  @ApiProperty({ example: '3-1', description: 'Score du match' })
  @IsString()
  @IsNotEmpty()
  score!: string;
}
