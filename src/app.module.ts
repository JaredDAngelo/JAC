import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocumentoModule } from './documento/documento.module';
import { ActaModule } from './acta/acta.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://JAC:Colombia2025++@cluster0.uy3al.mongodb.net/JAC'
    ),
    DocumentoModule,
    ActaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
