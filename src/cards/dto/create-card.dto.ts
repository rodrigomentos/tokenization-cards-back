
import { IsEmail, IsInt, IsNotEmpty, IsNumber, IsString, Length, Max, MaxLength, Min, MinLength} from "class-validator";
import { IsCVVValid } from "../../validators/cvv.validator";
import { IsEmailInDomain } from "../../validators/email.validator";
import { IsLuhnValid } from "../../validators/luhn.validator";
import { IsMonthValid } from "../../validators/month.validator";
import { IsYearWithinRange } from "../../validators/year.validator";

export class CreateCardDto {

    @IsNotEmpty({
        message: "El número de tarjeta no debe estar vacío"
    })
    @IsLuhnValid({
        message: 'Número de tarjeta no válido. Por favor verifique el número de tarjeta',
    })
    card_number: string;


    @IsNotEmpty({
        message: "El cvv de la tarjeta no debe estar vacío"
    })
    @IsNumber({},{
        message: "El cvv de la tarjeta es numerico"
    })
    @IsCVVValid({
        message: 'CVV no válido. Por favor verifique el número CVV',
    })    
    cvv: number;


    @IsNotEmpty({
        message: "El mes no debe estar vacío"
    })
    @IsString({
        message: "El mes no es numerico"
    })
    @IsMonthValid({ 
        message: 'El mes debe ser un número válido entre 1 y 12' 
    })
    expiration_month: string;


    @IsNotEmpty({
        message: "El año no debe estar vacío"
    })
    @IsString({
        message: "El año no es numerico"
    })
    @Length(4, 4, { 
        message: 'El año debe tener 4 caracteres'
    })    
    @IsYearWithinRange({
        message: 'El año debe ser el año actual o dentro de los próximos 5 años',
    })
    expiration_year: string;


    @IsNotEmpty({
        message: 'El correo electrónico no debe estar vacío',
    })
    @IsEmail({},{
        message: 'El correo electrónico inválido',
    })
    @MinLength(5, { 
        message: 'El correo electrónico debe tener al menos 5 caracteres'
    })
    @MaxLength(100, { 
        message: 'El correo electrónico debe tener menos de 100 caracteres o menos'
    })
    @IsEmailInDomain({
        message: 'El correo electrónico inválido. Sólo se permiten gmail.com, hotmail.com y yahoo.es',
    })
    email: string;


}