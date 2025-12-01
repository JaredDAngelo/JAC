import { IsNotEmpty, IsDateString, IsString, IsEnum } from 'class-validator';

export enum TipoCertificado {
  ACTA_EXISTENCIA = 'ACTA_EXISTENCIA',
  ACTA_DIRECTIVOS = 'ACTA_DIRECTIVOS',
  ACTA_LIBROS = 'ACTA_LIBROS',
  CERTIFICADO_ACTA = 'CERTIFICADO_ACTA',
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

  // @IsNotEmpty()
  // @IsString()
  // numeroRadicado: string;

  @IsNotEmpty()
  @IsString()
  ciudadEmision: string;

  // @IsNotEmpty()
  // @IsString()
  // nombreSecretario: string;

  // @IsNotEmpty()
  // @IsString()
  // cargoSecretario: string;

  // @IsNotEmpty()
  // @IsString()
  // nombreGobernador: string;
}
