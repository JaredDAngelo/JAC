import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose"; 
import { LibroController } from "./libro.controller";
import { LibroService } from "./libro.service";
import { LibroSchema } from "./schema/libro.schema";


@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: "libro",
        schema: LibroSchema,
      },
    ]),
  ],
  controllers: [LibroController],
  providers: [LibroService],
  exports: [LibroService],
})

export class LibroModule {}


