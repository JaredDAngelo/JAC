import { IsEnum, IsNotEmpty } from 'class-validator';

// * Enumeración de tipos de documentos permitidos
// * Se usa enum para definir un conjunto de valores
export enum TipoDocumento {
  GUIA_ESTATUTO = 'guia_estatuto',
  INTERES_ASOCIATIVO = 'interes_asociativo',
  ASAMBLEA_CONSTITUCION = 'asamblea_constitucion',
}

// * DTO para la creación y manejo de documentos
export class DocumentoDto {
  @IsEnum(TipoDocumento)
  @IsNotEmpty()
  tipo: TipoDocumento;

  @IsNotEmpty()
  contenido: Buffer;
}
