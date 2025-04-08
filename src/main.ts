import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
  .addBearerAuth()
  .setTitle('API REST')
  .setDescription('API REST para la gestion de usuarios')
  .setVersion('1.0')
  .addTag('Usuario')
  .build();


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
