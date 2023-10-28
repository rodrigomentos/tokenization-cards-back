import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type CardDocument = Card & Document;

@Schema()
export class Card {
    
    @Prop({ required: true })
    token: string;

    @Prop({ required: true })
    card_number: string;

    @Prop({ required: true })
    expiration_month: string;

    @Prop({ required: true })
    expiration_year: string;

    @Prop({ required: true })
    email: string;

    @Prop({
        default: new Date(Date.now())
    })
    createdAt: Date;

}

export const CardSchema = SchemaFactory.createForClass(Card);