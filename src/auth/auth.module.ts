import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { JwtRefreshStrategy } from './jtw-refresh.strategy';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      {
        name: User.name, schema: UserSchema
      },
    ]),
    
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: {expiresIn: process.env.JWT_EXPIRATION_TIME}      
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy]
})
export class AuthModule {}
