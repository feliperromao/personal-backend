import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeedService } from './seed/seed.service';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const seedService = appContext.get(SeedService);
  await seedService.runSeed();
  await appContext.close();
}

bootstrap();