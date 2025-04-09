import { IsEnum, IsNotEmpty } from "class-validator";
import { TipoDocumento } from "./create-documento.dto";

// * DTO para actualizar un documento
export class ActualizarDocumentoDto {
  @IsEnum(TipoDocumento)
  @IsNotEmpty()
  tipo: TipoDocumento;

  @IsNotEmpty()
  contenido: Buffer;
}