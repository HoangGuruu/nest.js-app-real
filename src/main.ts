import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { HttpAdapterHost} from '@nestjs/core';
import { SentryFilter } from './sentry.filter';
import * as Sentry from '@sentry/node';


async function bootstrap() {

  Sentry.init({
    dsn: "https://15f75f5f088943649cc11a83416d47a2@sentry.arckipel.com/5",
  });
  const appOptions = {cors: true};
  const app = await NestFactory.create(ApplicationModule, appOptions);
  // Import the filter globally, capturing all exceptions on all routes
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new SentryFilter(httpAdapter));



  app.setGlobalPrefix('api');

  const options = new DocumentBuilder()
    .setTitle('NestJS Realworld Example App')
    .setDescription('The Realworld API description')
    .setVersion('1.0')
    .setBasePath('api')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document);

  await app.listen(3000);
}
bootstrap();