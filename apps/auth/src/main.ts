import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino/Logger';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { transport } from 'pino';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  
  console.log("this is auth main");

  const app = await NestFactory.create(AuthModule);

  //instantiating the config service like this, allows you to 
  //retrieve any injectable
  const configService = app.get(ConfigService)


  //any code in main should be after the above nest factory line, which creates the module
  //below is how to connect microservices, remember it 
  //here if you do not specify the options argument and in that the host details
  //you will get an error like this::  reservations-1  |     err: {
  //reservations-1  |       "type": "Error",
// reservations-1  |       "message": "Connection closed",
// reservations-1  |       "stack":
// reservations-1  |           Error: Connection closed
// reservations-1  |               at ClientTCP.handleClose (/usr/src/app/node_modules/@nestjs/microservices/client/client-tcp.js:102:25)
// reservations-1  |               at Socket.<anonymous> (/usr/src/app/node_modules/@nestjs/microservices/client/client-tcp.js:92:55)
// reservations-1  |               at Socket.emit (node:events:519:35)
// reservations-1  |               at TCP.<anonymous> (node:net:350:12)
// reservations-1  |               at TCP.callbackTrampoline (node:internal/async_hooks:130:17)
// reservations-1  |     }

  //we are doing this because we have to setup a host where our TCP communication service should listen to
  //0.0.0.0, tells the microservice to bind to all interfaces on the host (ask chatgpt for more explanantions)
  app.connectMicroservice({transport: Transport.TCP, options: {
    host: '0.0.0.0',
    port: configService.get('TCP_PORT')
  }});
  app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));

  

    // Explicitly handle OPTIONS requests before enabling CORS
  // This middleware will respond to any OPTIONS request with appropriate CORS headers
  app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
      // Configure your allowed origin and headers as needed
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      return res.status(200).send();
    }
    next();
  });






  // Enable CORS here (on the HTTP server)
  // Adjust the origin and other options as needed.
  app.enableCors({
    origin: '*', 
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization'
  });

//hello
//hello
//hello testing again



  //to listen to events from microservices over the tcp transport layer
  await app.startAllMicroservices()

  //to listen to incoming http requests
  //changed the env variable name from PORT to HTTP_PORT, in order to be more descriptive
  await app.listen(configService.get("HTTP_PORT"));
}
bootstrap();
