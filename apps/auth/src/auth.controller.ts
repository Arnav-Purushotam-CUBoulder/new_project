import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser,UserDocument } from '@app/common';
import { Response } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //here you need to pass in the local strategy so that our auth strategy is run before
  //the post route is run
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    //a common pattern is to get access to the current user after you've authenticated them
    //this is how you can use decorators, see how i am passing in arguments, you can use
    //decorators like this to execute functions to get what you want and then directly pass
    //them as arguments in this clean manner
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true}) response: Response

    //here i want to get access to the response object as well as the passthrough property
    //becuase we want to set the JWT token as a cookie on the response object instead of passing as
    //plain text, because http cookies are much more secure
    //the passthrough option will allow us to make sure that the response is sent manually within
    //the route handler with the use of native response handling methods
  ){
   
    await this.authService.login(user,response);
    response.send(user);
  }


  //this decorator allows us to accept RPC calls from our chosen transport layer
  //think of it like the Get, Post, etc decorators that are a part of REST protocol
  //pass in the name of the message pattern in the arguments
  @UseGuards(JwtAuthGuard)
  @MessagePattern('authenticate')
  async authenticate(
    //payload decorator will extract the current payload for the given message pattern
    //rememeber: it is the same payload we are sending from the libs/common/src/auth/jwt-auth.guard.ts file
    //that payload is sent to the JwtAuthGuard in the auth microservice (where it goes to the jwt-strategy file)
    //which then sends back the user object here, if the authentication is successful (check the jwt strategy file for more details)
    @Payload() data: any
  ) {
    //console.log here i just used to check if the user is being properly authenticated against this route
    //if yes then it will print the user (which is what the jwt strategy returns on successful authentication)
    //console.log(data)
    return data.user;
  };




}
