import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
<<<<<<< HEAD
import { LibroModule } from './libro/libro.module';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://JAC:Colombia2025++@cluster0.uy3al.mongodb.net/JAC'),
    LibroModule],
=======
import { MongooseModule } from '@nestjs/mongoose';
import { UsuarioModule } from './usuario/usuario.module';
import { DocumentoModule } from './documento/documento.module';
import { ActaModule } from './acta/acta.module';
import { AuthModule } from './auth/auth.module';
import { CertificadoModule } from './certificado/certificado.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://JAC:Colombia2025++@cluster0.uy3al.mongodb.net/JAC'
    ),
    UsuarioModule,
    AuthModule,
    DocumentoModule,
    ActaModule,
    CertificadoModule,
  ],
>>>>>>> 68e1fd113c2dc50933b58ef13130347abae13a50
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
