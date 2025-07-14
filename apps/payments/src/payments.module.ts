import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { ConfigModule, ConfigService } from '@nestjs/config';


//remember to orrect this joi import, automatic import is import Joi from joi
//but the import we want is below
import * as Joi from 'joi';
import { LoggerModule, NOTIFICATIONS_SERVICE } from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { transport } from 'pino';
 

//when you create a new env variable, always come here and use Joi to verify it
//this method is to be remembered
@Module({
  imports: [ConfigModule.forRoot({
    //put isGlobal as true so that the configModule is available everywhere within this service
    isGlobal: true,
    envFilePath: './apps/payments/.env',
    validationSchema: Joi.object({

      //the below code is used for verifying verifying whether all .env variables exist or not
      //therefore you always have to come back here and make changes whenever you add a new .env variable
      PORT: Joi.number().required(),
      NOTIFICATIONS_PORT: Joi.number().required(),
      NOTIFICATIONS_HOST: Joi.string().required(),
      STRIPE_SECRET_KEY: Joi.string().required()
    })
  }),
LoggerModule,
//this is how you connect microservices, first you have to add a clientsModule here, that holds all of the clients
ClientsModule.registerAsync([
  {
    name: NOTIFICATIONS_SERVICE,
    useFactory: (configService: ConfigService) => ({
      transport: Transport.TCP,
      options: {
        host: configService.get('NOTIFICATIONS_HOST'),
        port: configService.get('NOTIFICATIONS_PORT')
      }

    }),
    inject: [ConfigService],
  }

])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
