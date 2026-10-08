import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),

    JwtModule.register({
      secret: 'factory-traffic-secret-key',
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],

  controllers: [AuthController],

  providers: [AuthService],

  exports: [AuthService, JwtModule],
})
export class AuthModule {}