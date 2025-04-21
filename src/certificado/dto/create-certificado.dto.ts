import { IsNotEmpty, IsDateString, IsString, IsEnum } from 'class-validator';

export enum TipoCertificado {
  GUIA_ESTATUTO = 'guia_estatuto',
  INTERES_ASOCIATIVO = 'interes_asociativo',
  ASAMBLEA_CONSTITUCION = 'asamblea_constitucion',
  ACTA_DE_CONSTITUCION = 'acta_constitucion',
  ACTA_DE_ELECCION_DE_DESTINATARIO = 'acta_eleccion_destinatario',
}

export class CertificadoDto {
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
