import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';

async function start() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    await app.listen(3000);
}

start();