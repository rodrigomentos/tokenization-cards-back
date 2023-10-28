import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, HttpException } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PKCommercial } from '../middlewares/PKCommercial.guard';
import { RedisService } from '../redis/RedisService';

@Controller('cards')
@ApiTags('cards')
//@ApiBearerAuth()
export class CardsController {
  constructor(private readonly cardsService: CardsService, private readonly redisService: RedisService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseGuards(PKCommercial)
  async create(@Body() createCardDto: CreateCardDto) {
    const newCard = await this.cardsService.create(createCardDto);
    
    await this.redisService.setValueWithExpiration(newCard.id, newCard.token, 900)
    return newCard;
  }

  
  @Get('/token/:token')
  @UseGuards(JwtAuthGuard)
  async findByToken(@Param('token') token: string) {
   
    const card = await  this.cardsService.findByToken(token);
    const cardEnabled =  await this.redisService.getValue(card.id)
    
    if(!cardEnabled){
      throw new HttpException('El token ha expirado tras 15 minutos de ser creados.', HttpStatus.NOT_FOUND);
    }

    return card;
  }

}
