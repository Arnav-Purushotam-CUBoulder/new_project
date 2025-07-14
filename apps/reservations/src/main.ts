import { NestFactory } from '@nestjs/core';
import { ReservationsModule } from './reservations.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';

//remember this import for cookieParser, whenever u are using it, do not go with the default import suggested by vscode
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  console.log("hello, this is reservations main.ts")
  const app = await NestFactory.create(ReservationsModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));

  //you need to parse cookies for the reservations microservice requests as well
  //because you want to maintain state accross the various requests
  app.use(cookieParser());
  //instantiating the config service like this, allows you to 
  //retrieve any injectable
  const configService = app.get(ConfigService)
  console.log("Resolved PORT from ConfigService:", configService.get("PORT"));

  await app.listen(configService.get("PORT"));
}
bootstrap();


//you have to protect all the routes in the reservations controller with a jwt guard
//so that only authorized users have access to them, this can be done after setting up
//communication between the various microservices (like auth and reservations)
//this is done using the tcp transport layer
//this is provided by nestjs out of the box
//in this case you have to make the auth microservice to listen to both
//over the internet http requests as well as communications from the reservations microservice