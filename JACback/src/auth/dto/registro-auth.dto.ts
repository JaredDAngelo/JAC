import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { LoginAuthDto } from './login-auth.dto';

export class RegistroAuthDto extends PartialType(LoginAuthDto) { 
    @IsNotEmpty()
    nombre: string;
    @IsNumber()
    cedula: number;
    @IsNumber()
    telefono: number;
}
