//this is the strategy that allows login with a user's email and password

import { Injectable, UnauthorizedException } from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import { Strategy } from "passport-local";
import { UsersService } from "../src/users/users.service";


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    //here the Strategy argument in PassportStrategy(Strategy) , its default name is 'local'
    //but you can change it by passing in a second argument like: PassportStrategy(Strategy,'new local')
    //this name has to be known as it is passed into any guards we would like to create
    constructor(private readonly usersService: UsersService){
        super({usernameField: 'email'})
    }
    
    async validate(email:string,password:string){

        try {
        return this.usersService.verifyUser(email,password)
        } catch(err){
            throw new UnauthorizedException(err)
        }
    }
}