
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class LoginAuthDto {

    @IsNotEmpty({ 
        message : "Debe ingresar un usuario"
    })
    @MaxLength(20, { 
        message : "El usuario debe tener menos de 20 caracteres o menos"
    })
    username: string;

    @IsNotEmpty({ 
        message : "Debe ingresar una contraseña"
    })    
    @MinLength(6, { 
        message: "La contraseña debe tener al menos 6 digitos"
    })
    @MaxLength(100, { 
        message : "La contraseña debe tener menos de 100 caracteres o menos"
    })
    password: string;
}