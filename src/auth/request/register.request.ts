import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsUrl, MinLength } from 'class-validator';

export class CreatePlayerRequest {
  @ApiProperty({ example: 'johndoe' })
  @IsString()
  username!: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail({}, { message: 'Email invalide' })
  email!: string;

  @ApiProperty({ example: 'password123', minLength: 8 })
  @IsString()
  @MinLength(8, { message: 'Le mot de passe doit faire au moins 8 caractères' })
  password!: string;

  @ApiProperty({ example: 'https://example.com/avatar.png' })
  @IsUrl({}, { message: "L'avatar doit être une URL valide" })
  avatar!: string;
}
