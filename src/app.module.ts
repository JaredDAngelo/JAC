import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LibroModule } from './libro/libro.module';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://JAC:Colombia2025++@cluster0.uy3al.mongodb.net/JAC'),
    LibroModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
