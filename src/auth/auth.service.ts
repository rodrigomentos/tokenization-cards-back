import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { CommonConstants, UserConstants } from '../utils/documentation.util';
import { User, UserDocument } from '../users/schemas/user.schema';
import { LoginAuthDto } from './dto/login-auth.dto';
import { LoginAuthResponseDto } from './dto/login-auth-response.dto';

@Injectable()
export class AuthService {

    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,        
        private jwtAuthService: JwtService,
    ){}

    async login(loginAuthDto: LoginAuthDto) {
        const { username, password } = loginAuthDto;
        const user = await this.userModel.findOne({username})
    
        if(!user) throw new HttpException(UserConstants.RESPONSE_NOT_FOUND, HttpStatus.NOT_FOUND);
    
        const checkPassword = await argon2.verify(user.password, password);
    
        if(!checkPassword) throw new HttpException(UserConstants.RESPONSE_PASSWORD_INCORRECT, HttpStatus.FORBIDDEN);
    
        return await this.returnLoginResponse(user);
    }
    
    async refreshTokens(userId: string, refreshToken: string) {
      const user = await this.userModel.findById(userId);
      if (!user || !user.refreshToken)
        throw new ForbiddenException(CommonConstants.ACCESS_DENIED);
  
      const refreshTokenMatches = await argon2.verify(user.refreshToken, refreshToken);
      
      if (!refreshTokenMatches) throw new ForbiddenException(CommonConstants.ACCESS_DENIED);
      
      return await this.returnLoginResponse(user);
    }
    
    async logout(userId: string) {
      await this.userModel.findByIdAndUpdate(userId, { "refreshToken": null });
    }
    
    async getTokens(userId: string, username: string) {
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtAuthService.signAsync(
          {
            userId: userId,
            username,
          },
          {
            secret: process.env.JWT_ACCESS_SECRET,
            expiresIn: process.env.JWT_EXPIRATION_TIME,
          },
        ),
        this.jwtAuthService.signAsync(
          {
            userId: userId,
            username,
          },
          {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: '15m',
          },
        ),
      ]);
  
      return {
        accessToken,
        refreshToken,
      };
    }
    
    hashData(data: string) {
      return argon2.hash(data);
    }
    
    async updateRefreshToken(userId, refreshToken) {
      const hashedRefreshToken = await this.hashData(refreshToken);
         
      
      await this.userModel.findByIdAndUpdate(userId, {"refreshToken": hashedRefreshToken});
    }
    
    async returnLoginResponse(user) {
      const tokens = await this.getTokens(user.id, user.name);
  
      const loginAuthResponseDto = new LoginAuthResponseDto();
      loginAuthResponseDto.userId = user.id;
      loginAuthResponseDto.userName = user.username;
      loginAuthResponseDto.accessToken = tokens.accessToken;
      loginAuthResponseDto.refreshToken = tokens.refreshToken;
      loginAuthResponseDto.tokenCommercial = process.env.PK_COMMERCIAL
      this.updateRefreshToken(user.id, tokens.refreshToken);
  
      return loginAuthResponseDto;
    }
}
