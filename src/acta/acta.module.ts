import { Module } from '@nestjs/common';
import { ActaService } from './acta.service';
import { ActaController } from './acta.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ActaSchema } from './entities/acta.entity';


@Module({
  imports: [MongooseModule.forFeature([{ name: 'Acta' , schema: ActaSchema }])],
  controllers: [ActaController],
  providers: [ActaService],
  exports:[ActaService]
})
export class ActaModule {}
