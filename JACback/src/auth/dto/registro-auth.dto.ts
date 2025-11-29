import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { LoginAuthDto } from './login-auth.dto';

export class RegistroAuthDto extends PartialType(LoginAuthDto) {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNumber()
  @IsNotEmpty()
  cedula: number;

  @IsOptional()
  @IsString()
  telefono?: string;
}
