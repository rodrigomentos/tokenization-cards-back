import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CardsModule } from './cards/cards.module';

const { NODE_ENV, MONGO_URI, MONGO_URI_TEST } = process.env

@Module({
  imports: [
    ConfigModule.forRoot({envFilePath: '.env', isGlobal: true}),
    MongooseModule.forRoot( NODE_ENV === 'test'? MONGO_URI_TEST: MONGO_URI),
    UsersModule,
    AuthModule,
    CardsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
