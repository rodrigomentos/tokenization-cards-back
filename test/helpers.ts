import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Body, INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UserDocument, UserSchema } from '../src/users/schemas/user.schema';
import { hash } from "argon2";
import { Model } from 'mongoose';
import { CreateCardDto } from '../src/cards/dto/create-card.dto';
import { CardDocument, CardSchema } from '../src/cards/schemas/card.schema';
import { RedisService } from '../src/redis/RedisService';

  let app: INestApplication;
  let UserModel: Model<UserDocument>;
  let CardModel: Model<CardDocument>;
  let redis: RedisService;
  const usernameLogin: string = 'UserTest';
  const passwordLogin: string = 'UserPasswordTest';
  const pk_commercial: string = process.env.PK_COMMERCIAL
  const newCard: CreateCardDto = {
      card_number: "4111111111111111",
      cvv: 123,
      expiration_month: "12",
      expiration_year: "2023",
      email: "rodrigo@gmail.com"
  }

  
  beforeAll(async () => {
      process.env.NODE_ENV == 'test'
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [
          AppModule,      
          MongooseModule.forFeature([
            {
              name: 'User',
              schema: UserSchema,
            },
            {
              name: 'Card',
              schema: CardSchema,
            },
          ]),
        ],
      })
      .compile();

      redis = moduleFixture.get<RedisService>(RedisService);
      UserModel = moduleFixture.get(getModelToken('User'));
      CardModel = moduleFixture.get(getModelToken('Card'));

      await UserModel.deleteMany({})
      await CardModel.deleteMany({})
      const passwordHash = await hash(passwordLogin);
      await UserModel.create({username: usernameLogin, password: passwordHash});
      
      app = moduleFixture.createNestApplication();
      app.useGlobalPipes(new ValidationPipe())

      await app.init();
  });


  const login = async () => {
    const response = await request(app.getHttpServer()).post('/auth/login').send({ username: usernameLogin, password: passwordLogin })
    return response.body
  }

  const storeCard = async () => {
    const response = await request(app.getHttpServer())        
            .post(`/cards`)
            .set('Authorization', `Bearer ${pk_commercial}`)
            .send(newCard)
    return response.body
  }


  const storeCardWithImmediateExpiration = async () => {
    const response = await request(app.getHttpServer())        
            .post(`/cards`)
            .set('Authorization', `Bearer ${pk_commercial}`)
            .send(newCard)
    redis.destroyValue(response.body._id)
    return response.body
  }


export { app , login, usernameLogin, passwordLogin, pk_commercial, newCard, storeCard, storeCardWithImmediateExpiration }