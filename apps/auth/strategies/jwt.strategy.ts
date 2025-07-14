//this strategy is required as we have to authenticate the jwt token itself
//so that the user can have access to all of our microservices
//like this you can create strategies to handle security stuff in your application
//like authentication, etc

//if you want to create an  AuthGuard you first need to create a strategy which it can use
//and then use that strategy to pass into the authguard

import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { UsersService } from "../src/users/users.service";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { ExtractJwt } from "passport-jwt";
import { TokenPayload } from "../src/interfaces/token-payload.interface";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    //it extends the same Strategy as last time but with just a few configuration changes
    //which you have to specify in the super, inside the constructor, make sure to remember this
    constructor(
        configService: ConfigService,
        private readonly usersService: UsersService

    ){
        //super call always has to exist when there is constructor
        //and it has to be inside the constructor
        super({
            //by default the jwt will be a header value, but in our case its
            //a cookie value, so we have to specify that
            jwtFromRequest: ExtractJwt.fromExtractors([
                //u are telling where to look for the jwt exactly, remember that the 
                //name of the cookie was Authentication
                // here (request: Request) is the input
                //(request: Request) => request?.cookies?.Authentication 

                //now given that the jwt cookie can come from a http request and also an RPC call (from another microservice)
                //we have to use the below code instead
                //type is any, because it can come from either, remember this format of using any, when dealing with such problems
                // || means if the previous does not exist i.e. cookies dont exist on an rpc call, the execute the code that follows ||
                //here the jwt token is directly on the header of the RPC request as key therefore it can be accessed directly as specified below
                (request: any) => request?.cookies?.Authentication || request?.Authentication
            ]),
            //now specify the secret value in order to decrypt the JWT token
            secretOrKey: configService.get('JWT_SECRET'),

        });
    }

    async validate({userId}: TokenPayload){
        //go back to the auth service and check the tokenpayload, in that i specified
        //(included) the userId, therefore the token payload looks like {userId}, thats why 
        //i specified that as an input, because the fucntion that calls validate will provide
        //validate with the tokenPayload as input, now i generalised this tokenPayload as an interface
        //so now thats why i specified type as TokenPayload

        //first check if the user from the payload actually exists
        return this.usersService.getUser({_id:userId})

    }

}