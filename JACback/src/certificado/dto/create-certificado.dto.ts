import { IsNotEmpty, IsDateString, IsString, IsEnum } from 'class-validator';

export enum TipoCertificado {
  GUIA_ESTATUTO = 'GUIA_ESTATUTO',
  ACTA_CONSTITUCION = 'ACTA_CONSTITUCION',
  ACTA_ELECCION = 'ACTA_ELECCION_DESTINATARIO',
  ASAMBLEA_CONSTITUCION = 'ASAMBLEA_CONSTITUCION',
  INTERES_ASOCIATIVO = 'INTERES_ASOCIATIVO',
}

export class CreateCertificadoDto {
  @IsEnum(TipoCertificado)
  @IsNotEmpty()
  tipo: TipoCertificado;

  @IsNotEmpty()
  @IsString()
  nombreJunta: string;

  @IsNotEmpty()
  @IsDateString()
  fechaEmision: Date;

  @IsNotEmpty()
  @IsString()
  numeroRadicado: string;

  @IsNotEmpty()
  @IsString()
  ciudadEmision: string;

  @IsNotEmpty()
  @IsString()
  nombreSecretario: string;

  @IsNotEmpty()
  @IsString()
  cargoSecretario: string;

  @IsNotEmpty()
  @IsString()
  nombreGobernador: string;
}
