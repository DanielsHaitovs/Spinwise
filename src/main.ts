import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        cors: true,
    });

    app.useGlobalPipes(new ValidationPipe());

    const configService = app.get(ConfigService);

    const config = new DocumentBuilder().setTitle('User Microservice').setDescription('Spinwise User Microservice Test Task').setVersion('1.0').build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(configService.get<string>('PORT') || 3000);
}

void bootstrap();
