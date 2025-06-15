import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { TransformInterceptor } from './core/transform.interceptor';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const reflector = app.get( Reflector );

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  // Set the view engine to EJS
  app.setViewEngine('ejs');

  // Use global pipes to validate incoming requests
  app.useGlobalPipes(new ValidationPipe());
  
  // Use global guards to protect routes that require authentication
  app.useGlobalGuards( new JwtAuthGuard( reflector ) );

  // Config interceptor to transform response data, so that it can be consistent across the application
  app.useGlobalInterceptors(new TransformInterceptor(reflector));

  // config cors
  app.enableCors(
    {
      "origin": "*",
      "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
      "preflightContinue": false,
      "optionsSuccessStatus": 204
    }
  );

  // Use cookie parser to parse cookies in requests
  app.use(cookieParser());

  // config versioning
  app.setGlobalPrefix('api');
  app.enableVersioning({
    defaultVersion: ['1', '2'],
    type: VersioningType.URI,
  });

  await app.listen(configService.get<number>('PORT'));
}
bootstrap();
