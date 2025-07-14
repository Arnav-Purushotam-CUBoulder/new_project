import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreateChargeDto, NOTIFICATIONS_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Injectable()
export class PaymentsService {
  //clients like the one below always use private readonly
  //also  in order to actually access an env variable, you can do ::  this.configService.get('STRIPE_SECRET_KEY')  (remember this as well)
  private readonly stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'),{
    apiVersion:'2024-10-28.acacia' as any,
  });
  

  //always remember that in order to access the env variables inside another service
  //you will need to inject the ConfigService like below inside the constructor (using private readonly )
  constructor(private readonly configService: ConfigService, @Inject(NOTIFICATIONS_SERVICE) private readonly notificationsService: ClientProxy){

  }



  //this was initially how the inputs to the method createCharge looked:
  //createCharge(card: Stripe.PaymentMethodCreateParams.Card, amount: number)
  //but then i changed the inputs so that it directly takes from the dto itself
  //(you should do this after creating the dto)
  //remember the syntax for doing this i.e.::  {card,amount}: CreateChargeDto



  async createCharge({card,amount,email}: PaymentsCreateChargeDto){
    //(as direct handling of credit card info is no longer allowed, we now have to handle only using tokens), therefore payment method not required
    const paymentMethod = await this.stripe.paymentMethods.create({
      type: 'card',
      card: { token: card.token }, // Use the token to create a PaymentMethod

    });

    const paymentIntent = await this.stripe.paymentIntents.create({
      payment_method: paymentMethod.id, 
      //by default smallest unit of currency (i.e. cent) is considered in the stripe API
      amount: amount * 100,
      confirm: true,
      payment_method_types: ['card'],
      currency: 'usd',
    });

    //after the user is charged is when we have to send the notification
    this.notificationsService.emit('notify_email',{ 
      email,
      text: `Your payment of $${amount} has completed successfully` })

    return paymentIntent; 
  }
  
  
}
