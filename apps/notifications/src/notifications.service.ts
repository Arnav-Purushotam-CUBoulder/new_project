import { Injectable } from '@nestjs/common';
import { NotifyEmailDto } from './dto/notify-email.dto';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationsService {
  //if you want the config service just write a constructor in the class you need it in, and inject it like this
  constructor(private readonly configService: ConfigService){
    
  }

  private readonly transporter = nodemailer.createTransport({
    //i am using gmail here as the smtp provider as it allows sending 5000 emails per day
    //but you can use any smtp provider you want (which have various rates)
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: this.configService.get('SMTP_USER'),
      //this client id is required to authenticate with nodemailer
      clientId: this.configService.get('GOOGLE_OAUTH_CLIENT_ID'),
      clientSecret: this.configService.get('GOOGLE_OAUTH_CLIENT_SECRET'),
      refreshToken: this.configService.get('GOOGLE_OAUTH_REFRESH_TOKEN'),

    }

  })

  async notifyEmail({email,text}:NotifyEmailDto){
    //console.log(email)
    await this.transporter.sendMail({
      from: this.configService.get('SMTP_USER'),
      to: email,
      subject: "Reservation Notification",
      text,

    })
  }
}
