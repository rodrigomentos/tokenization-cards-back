
import { IsEmail, IsNotEmpty, Length} from "class-validator";

export class FindCardTokenDto {

    @IsNotEmpty({ message : "Debe ingresar el token"})
    @Length(16, 16, { 
        message: 'El año debe tener 4 caracteres'
    })
    token: string;
}