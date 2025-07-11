import { Type } from 'class-transformer';
import { 
  IsArray, 
  IsNotEmpty, 
  IsString, 
  ValidateNested, 
  IsOptional 
} from 'class-validator';
import { ActaDto } from '../../acta/dto/create-acta.dto';
import { DocumentoDto } from '../../documento/dto/create-documento.dto';
import { LibrosDto } from 'src/libro/dto/create-libro.dto';


export class JuntaDto {
  @IsNotEmpty()
  @IsString()
  nombreJunta: string;

  @IsNotEmpty()
  @IsString()
  direccion: string;

  @IsNotEmpty()
  @IsString()
  departamento: string;

  @IsNotEmpty()
  @IsString()
  municipio: string;

  @IsNotEmpty()
  @IsString()
  barrio: string;

  @IsNotEmpty()
  @IsString()
  presidente: string;

  @IsNotEmpty()
  @IsString()
  vicepresidente: string;

  @IsNotEmpty()
  @IsString()
  tesorero: string;

  @IsNotEmpty()
  @IsString()
  secretario: string;

  @IsNotEmpty()
  @IsString()
  coordinador: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DocumentoDto)
  documentos?: DocumentoDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActaDto)
  actas?: ActaDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LibrosDto)
  libros?: LibrosDto[];
}