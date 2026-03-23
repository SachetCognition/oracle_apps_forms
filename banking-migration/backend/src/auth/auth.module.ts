import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { RegisteredInfo } from '../entities/registered-info.entity';
import { Manager } from '../entities/manager.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RegisteredInfo, Manager]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'banking-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
