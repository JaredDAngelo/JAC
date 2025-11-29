import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LibroModule } from './libro/libro.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuarioModule } from './usuario/usuario.module';
import { DocumentoModule } from './documento/documento.module';
import { ActaModule } from './acta/acta.module';
import { AuthModule } from './auth/auth.module';
import { CertificadoModule } from './certificado/certificado.module';
import { JuntaModule } from './junta/junta.module';
import { RoleModule } from './role/role.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://JAC:Colombia2025++@cluster0.uy3al.mongodb.net/JAC'
    ),
    UsuarioModule,
    AuthModule,
    DocumentoModule,
    ActaModule,
    LibroModule,
    CertificadoModule,
    JuntaModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
