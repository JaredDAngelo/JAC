import {
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsString,
    MinLength,
    IsOptional,
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

    // opcional: referencia a la junta a la que pertenece el usuario (id o nombre)
  @IsOptional()
  @IsString()
  junta?: string;

    // estado del usuario en la aplicación
    @IsOptional()
    @IsString()
    estado?: string;
  }
  