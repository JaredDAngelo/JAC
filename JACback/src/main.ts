import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ HABILITAR CORS para permitir peticiones desde el frontend
  app.enableCors({
    origin: 'http://localhost:5173', // Aquí se define el origen permitido
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('API REST')
    .setDescription('API REST para la gestion de usuarios')
    .setVersion('1.0')
    .addTag('Usuario')
    .build();

  // Si estás usando SwaggerModule, no lo olvides montar también:
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Esto habilita la doc en /api

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
