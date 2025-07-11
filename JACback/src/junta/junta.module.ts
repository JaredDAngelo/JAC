import { Module } from '@nestjs/common';
import { JuntaService } from './junta.service';
import { JuntaController } from './junta.controller';
import { JuntaSchema } from './schema/junta.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Junta',
        schema: JuntaSchema,
      },
    ]),
  ],
  controllers: [JuntaController],
  providers: [JuntaService],
  exports: [JuntaService],
})
export class JuntaModule {}
