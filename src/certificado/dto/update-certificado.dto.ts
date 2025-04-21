import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TipoCertificado } from './create-certificado.dto';

export class ActualizarDocumentoDto {
  @IsNotEmpty()
  @IsString()
  titulo: string;

  @IsNotEmpty()
  @IsDateString()
  fechaEmision: Date;

  @IsEnum(TipoCertificado)
  @IsNotEmpty()
  tipo: TipoCertificado;
}
