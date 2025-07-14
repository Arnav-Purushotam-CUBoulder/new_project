import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { catchError, map, Observable, of, tap } from "rxjs";
import { AUTH_SERVICE } from "../constants/services";
import { ClientProxy } from "@nestjs/microservices";
import { UserDto } from "@app/common";


//remember the difference between the two JwtAuthGuards that we have
//the one inside the guards folder in the auth microservice is used to actually authenticate the jwtToken (obtained from inside the cookie) (this is what actually holds the jwt token authentication logic)
//the AuthGuard in this file is used to basically reroute a request coming to the reservations microservice to 
//the auth microservice in order to authenticate the jwt token of that request (using the auth guard code specified in the guards folder in the auth microservice)
//this is an example access trace of the user::
//user (using postman) after logging in (he has the jwt token in the cookie) tries to POST a request to /reservations route
//here now, that POST route is protected using this JwtAuthGuard (check the reservations controller to actually see the guard)
//that guard comes here (or actually what happens is, an instantiation of the JwtAuthGuard is created), but the logic in that is obv what is in this file itself
//the logic sees that the jwt token exists and sends an RPC call to the auth microservice using a message pattern of the type 'authenticate'
//that RPC call contains the following things: the jwt token and also the user data
//the specific route within the auth controller catches it (due to its message pattern), then since that route has the JwtAuthGuard decorator it calls that code (i.e. the code in the jwt strategy) and authenticates the jwt
//if successful then it executes the validate method (in the jwt strategy file) which returns the user (how is this possible? on decoding the jwt token using the secret key, the userId is obtained, from which validate method searches the database for that user)
//then control returns here (obv user object from the database is contained in the response from the auth microserivce), which this logic::  context.switchToHttp().getRequest().user = res;
//puts onto the request body, now why put it onto the request body? so that we can use the currentUser decorator to extract the user from the execution context i.e. from the request

@Injectable()
export class JwtAuthGuard implements CanActivate {



    //now in order to verify the jwt token, you need a user proxy (which is exactly what it sounds like)
    //and then use to communicate with the auth microservice (via the provided transport layer) in order to verify the jwt
    //after the below statement you have to set up a route in the auth controller to handle RPC calls from this client proxy
    constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy){}



    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        






        //here this expects a jwt token in order to authenticate
        //how to get the jwt token?
        //first get the request object then from that you can get the jwttoken
        //remember the below line of code to get the request anywhere
        //(keep in mind to get the request you will need the execution context object)
        //(therefore in areas where you need the request object, for example like here)
        //(where we are protecting the routes via authentication of the cookie on the request object)
        //(remember to implement or extend the appropriate class or interface, here the CanActivate interface does exactly that)
        //(make sure to look into its documentation and remember it)

        //here cookies object can also be null thats why there is a '?'
        const jwt = context.switchToHttp().getRequest().cookies?.Authentication;
        if(!jwt){
            //returning false here as this is how the CanActivate function within the interface has to be implemented
            //check the documentation for more details

            //from the docs:
            //(alias) interface CanActivate
            //import CanActivate
            //Interface defining the canActivate() function that must be implemented by a guard. 
            //Return value indicates whether or not the current request is allowed to proceed. 
            // Return can be either synchronous (boolean) or asynchronous (Promise or Observable).
            return false
        }


        //now time to actually send this jwtToken to the auth microservice using the ClientProxy and the transport layer that we set up
        //first argument is the message pattern which is 'authenticate', second argument is the data to be send in the RPC call
        //it is specified as key value pairs in { }
        //remember this code in order to send data between microservices

        //this is of the type Observable, check nestjs docs for more info on it
        //use pipe on this, in order to process the response output (from auth microservice, which just sends back the user)
        return this.authClient.send<UserDto>('authenticate', {
            //setting the type of the send method as <UserDto> will give us better type inference and actually specify the response as a UserDto object (the object is attached to the request body)
            Authentication: jwt
        }).pipe(
            //tap operator from rxjs allows us to specify side effects on the incoming response
            tap((res) => {
                //here we just want to add the user object from the response (from auth microservice) onto the request object
                context.switchToHttp().getRequest().user = res;
            }),
            map(() => true),

            //return true using the map operator if we have a successful response from the auth microservice (and not an error)
            //now canActivate (if it returns a True) will allow the request to proceed

            //here if any error occurs in the above auth code, it will simply return false
            //thus enabling graceful handling (i.e. it gives the 403 forbidden resource error instead of the general 500 internal server error)
            //remember to do stuff like this, when something goes wrong it should be gracefully handled (i.e. its own error should be given, instead of a general 500 internal server error)
            catchError(()=> of(false))
        )
    }



}