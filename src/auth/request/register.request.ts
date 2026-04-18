import { IsEmail, IsString, IsUrl, MinLength } from "class-validator";

export class CreatePlayerRequest {
  @IsString()
  username!: string;
    
  @IsEmail({}, { message: 'Email invalide' })
  email!: string;

  @IsString()
  @MinLength(8, { message: 'Le mot de passe doit faire au moins 8 caractères' })
  password!: string;

  @IsUrl({}, { message: "L'avatar doit être une URL valide" })
  avatar!: string;
}
