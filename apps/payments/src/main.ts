import { NestFactory } from '@nestjs/core';
import { PaymentsModule } from './payments.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { transport } from 'pino';
import { Logger } from 'nestjs-pino';

async function bootstrap() {


  //const app = await NestFactory.createMicroservice(PaymentsModule, {
    //here in the second argument specify options for the microservice
   // transport: Transport.TCP
   
  //now if you do like above, we cannot pull the config service in order to get our environment variables
  //therefore we have to do like how we created the auth microservice itself, i.e. create an app
  //remember this method to create a microservice
  const app = await NestFactory.create(PaymentsModule)
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
        host: '0.0.0.0',
        port: configService.get('PORT')
    }
  })

  app.useLogger(app.get(Logger))
  await app.startAllMicroservices()
}
bootstrap();
