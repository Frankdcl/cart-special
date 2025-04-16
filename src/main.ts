import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('bootstrap');

  // Habilitar CORS para todos los orígenes
  const allowedOrigins = [
    'http://localhost:5501',
    'https://lustrous-jelly-a302ba.netlify.app',
    'https://cart-special.vercel.app',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // Permitir llamadas desde herramientas como Postman (sin origen)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'ngrok-skip-browser-warning',
    ],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  // app.use(express.static(join(__dirname, '..', 'public'), {
  //   index: 'login.html' // Fuerza a servir login.html en /
  // }));

  await app.listen(process.env.PORT ?? 3000);
  logger.log(`App running on port ${process.env.PORT}`);
  

}
bootstrap();

