import {
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsString,
    MinLength,
  } from 'class-validator';
  
  export class CrearUsuarioDto {
    @IsString()
    nombre: string;
  
    @IsEmail()
    @IsNotEmpty()
    correo: string;
  
    @IsNotEmpty()
    @MinLength(6)
    contraseña: string;
  
    @IsNumber()
    @IsNotEmpty()
    cedula: number;
  
    @IsString()
    telefono: string;
  }
  