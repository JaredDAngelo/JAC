import { IsDate, IsEnum, IsNotEmpty, IsString } from "class-validator";

export enum tipoLibro {
    libroActas = "libro_actas",
    libroAfiliados ="libro_afiliados", 
    libroInventarios = "libro_inventarios", 
    libroTesoreria = "Libro_Tesoreria"
}

export class LibrosDto {
    @IsEnum(tipoLibro)
    @IsNotEmpty()
    tipo : tipoLibro;
 
    @IsNotEmpty()
    contenidoLibro : Buffer

}