import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '@app/common';
import { Response } from 'express';
import { TokenPayload } from './interfaces/token-payload.interface';

@Injectable()
export class AuthService {
  //constructor always has to have { } curly braces after the arguments
  //otherwise there will be errors
  constructor(private readonly configService: ConfigService, 
    private readonly jwtService: JwtService) {}

  async login(user: UserDocument,response:Response){
    const tokenPayload : TokenPayload = {userId: user._id.toHexString()}

    //because you need a jwt token that expires, you have to do the below
    //first get the currentSeconds and then get the JWT_EXPIRATION .env variable
    //then add both so as to have a future time for when the jwtToken will expire
    const expires = new Date()
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION')
    );

    //this will get the jwtToken, jwtToken for a specific user obv has to be signed by that userId
    const token = this.jwtService.sign(tokenPayload)

    //now to set the authentication cookie on the response object
    //as you can see name of the cookie is 'Authentication'
    //also we are passing in the signed token, the third argument is to configure some more options for our cookie
    //remember this, this is how you set response cookies, use the express response object (after importing it)
    //also check docs
    response.cookie('Authentication',token,{
      //below option makes sure this cookie is only available to httpRequests only
      //making it more secure, so that people cant deal with this cookie on the client side
      //without sending requests
      //also make sure to set the expiration for the cookie as the expiration for the jwtItself
      httpOnly:true,
      expires,
    })


  }


}
