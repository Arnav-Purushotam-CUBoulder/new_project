import { Body,Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { CurrentUser } from '@app/common';
import { UserDocument } from '@app/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UsersProfileService } from './usersProfile.service';
import { GetUserProfileDto } from './dto/get-user-profile.dto';


//you see the 'users' prefix inside the Controller decorator? that is the path that you should specify in the url
//after the port, then it comes to the controller of this particular application
@Controller('users')
export class UsersController {
  
    constructor(private readonly usersService: UsersService, private readonly usersProfileService: UsersProfileService){}

    @Post('profile')
    async createUserProfile(@Body() createUserProfileDto: CreateUserProfileDto){
        return this.usersProfileService.createProfile(createUserProfileDto)
    }

    @Get('profile')
    async getUserProfile(@Query('email') email: string) {
    return this.usersProfileService.getUserProfile({ email });
}

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto){
        return this.usersService.create(createUserDto)
    }

    //now if the userService.create method returns an error
    //like 'email already exists' UnprocessableEntityException error
    //it will be returned in the post route itself directly and will be visible 
    //on the response body alongwith the error message, NestJS handles this
    //so for any exception regarding your logic that you want to place you can do this
    //like for exmaple item is not present in the database or out of stock, etc
    //you can do this

    //this is how you use guards
    //specify a route in the controller, then use the
    //@UseGuards Decorator, then pass in the guard that you made, 
    //here either the local guard or the JWT Guard
    //similarly, like below you can pass in decorators directly into the arguments
    //this way it will execute and get the user, this will avoid you from writing logic inside the 
    //route itself, and is more cleaner, select the decorator for more details on how it is implemented
    @Get()
    @UseGuards(JwtAuthGuard)
    async getUser(@CurrentUser() user: UserDocument){
        return user;

        //here for this route you obv need the jwtToken in order to execute it
        //which is in the cookie object of the previous request, but in order to get it from that cookie
        //object and then put it on the cookie of the getUser request, we have to use cookie-parser package
        //check the auth main.ts file on how to do that (you have to set this up in the auth main.ts file itself)

    }
}
