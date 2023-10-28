import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Card, CardDocument } from './schemas/card.schema';
import { generateTextWithLength } from '../utils/generator.utils';

@Injectable()
export class CardsService {

  constructor(
      @InjectModel(Card.name) private readonly cardModel: Model<CardDocument>,        
      
  ){}

  async create(createCardDto: CreateCardDto) {
    const newCard = await this.cardModel.create({
        token: generateTextWithLength(16),
        card_number: createCardDto.card_number,
        email: createCardDto.email,
        expiration_month: createCardDto.expiration_month,
        expiration_year: createCardDto.expiration_year,          
      });
    return newCard
  }

  async findByToken(token: string) {
    const card = await this.cardModel.findOne({token})
    
    if(!card) throw new HttpException('Token no encontrado', HttpStatus.NOT_FOUND);

    return card
  }
}