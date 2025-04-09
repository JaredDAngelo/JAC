import { IsEmail, MinLength } from 'class-validator';


export class LoginAuthDto {
    @IsEmail()
    correo: string;

    @MinLength(6)
    contraseña: string;
}
