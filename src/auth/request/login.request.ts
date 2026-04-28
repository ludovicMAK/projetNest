import { IsString } from 'class-validator';

export class LoginPlayerRequest {
  @IsString()
  username!: string;

  @IsString()
  password!: string;
}
