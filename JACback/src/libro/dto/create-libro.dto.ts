import { IsEnum, IsNotEmpty, IsOptional, IsString, IsMongoId } from "class-validator";

export enum TipoLibro {
    LIBRO_ACTAS       = 'libro_actas',
    LIBRO_AFILIADOS   = 'libro_afiliados', 
    LIBRO_INVENTARIOS = 'libro_inventarios', 
    LIBRO_TESORERIA   = 'Libro_Tesoreria',
}

export class LibrosDto {
    @IsEnum(TipoLibro)
    @IsNotEmpty()
    tipo : TipoLibro;
 
    @IsOptional()
    contenidoLibro : Buffer
    
    @IsOptional()
    @IsString()
    nombre?: string;

    @IsOptional()
    @IsMongoId()
    junta?: string;
}