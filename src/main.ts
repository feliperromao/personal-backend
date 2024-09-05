import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const APP_PORT = 3020

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Habilitar CORS com opções específicas
  app.enableCors({
    origin: process.env.FRONTEND_APP_URL || 'http://localhost:3003',
    methods: 'GET,POST,PUT,DELETE,FETCH',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });
  await app.listen(APP_PORT);
  console.log("🚀 Application is running on:", APP_PORT)
}
bootstrap();
