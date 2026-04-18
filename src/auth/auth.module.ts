
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { PlayerModule } from '../player/player.module';

@Module({
  imports: [
    PlayerModule,
    PassportModule.register({ session: true }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '4h' },
      

    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
