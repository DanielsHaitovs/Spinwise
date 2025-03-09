import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        cors: true,
    });

    app.useGlobalPipes(
        new ValidationPipe({
            skipMissingProperties: false,
            transform: true,
        }),
    );

    app.useGlobalFilters(new AllExceptionsFilter());

    const configService = app.get(ConfigService);

    const config = new DocumentBuilder().setTitle('User Microservice').setDescription('Spinwise User Microservice Test Task').setVersion('1.0').build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(configService.get<string>('API_PORT') || 3001);
}

void bootstrap();
