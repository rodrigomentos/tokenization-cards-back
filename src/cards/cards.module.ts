import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Card, CardSchema } from './schemas/card.schema';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Mongoose } from 'mongoose';
import { RedisService } from '../redis/RedisService';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      {
        name: Card.name, schema: CardSchema
      },
    ]),
    
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: {expiresIn: process.env.JWT_EXPIRATION_TIME}      
    })
  ],
  controllers: [CardsController],
  providers: [CardsService, Mongoose, JwtService, RedisService]
})
export class CardsModule {}
