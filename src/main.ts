import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BullDashboardService } from './bull-dashboard/bull-dashboard.service';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: '*',
      credentials: true,
    },
  });
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  const bullBoard = app.get(BullDashboardService);
  bullBoard.setupBullBoard(app);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;
  await app.listen(port, () => Logger.log(`Application running on http://localhost:${port}`));
}

bootstrap();
