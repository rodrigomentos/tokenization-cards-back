import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type UserDocument = User & Document;

@Schema()
export class User {
    
    @Prop({
        unique: true,
        required: true,
        trim: true,
    })
    username: string;


    @Prop({ required: true })
    password: string;

    @Prop()
    refreshToken: string;

}

export const UserSchema = SchemaFactory.createForClass(User);