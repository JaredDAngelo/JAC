import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';
import { LoginAuthDto } from './login-auth.dto';

export class RegistroAuthDto extends PartialType(LoginAuthDto) { 
    @IsNotEmpty()
    nombre: string;
}
