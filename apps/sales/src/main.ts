import { NestFactory } from '@nestjs/core';
import { SalesModule } from './sales.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
//remember this import for cookieParser, whenever u are using it, do not go with the default import suggested by vscode
import * as cookieParser from 'cookie-parser';






async function bootstrap() {
  console.log("hello, this is Sales microservice main.ts")
  const app = await NestFactory.create(SalesModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));

  //you need to parse cookies for the reservations microservice requests as well
  //because you want to maintain state accross the various requests
  app.use(cookieParser());
  //instantiating the config service like this, allows you to 
  //retrieve any injectable
  const configService = app.get(ConfigService)
  console.log("Resolved PORT from ConfigService:", configService.get("PORT"));
  console.log("Resolved INVENTORY PORT from ConfigService:", configService.get("INVENTORY_PORT"));

  // // This line is crucial. It starts the microservice layer.
  // await app.startAllMicroservices();

  await app.listen(configService.get("PORT"));
}
bootstrap();


















//Inventory APIs:
//post a product (multiple products might be in a single body)
//get all products


//Sales APIs
//GET Api of the products table (get all the records in it)
//POST APi request (go through each product quantity and quantites to each product, then return the same request body with the id of the order ofc)


//fix the cors issue
//create sales and inventory services
//change schema in auth: include firstName, lastName, phoneNumber, Gender (check in notes)