import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class SubmitResultDto {
  @ApiProperty({
    example: 'uuid-du-gagnant',
    description: 'UUID du joueur gagnant (player1 ou player2)',
  })
  
  @IsUUID()
  winnerId!: string;

  @IsString()
  @IsNotEmpty()
  score!: string;
}
