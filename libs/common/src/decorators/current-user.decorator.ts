import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserDocument } from "@app/common";

const getCurrentUserByContext = (context: ExecutionContext) : UserDocument => {
    //here, why are we returning the type UserDocument?
    //because when you look at the strategy which calls this, (the local strategy)
    //remember that the local strategy calls the verifyUser method from the user_services
    //which returns the user object (which is of the type UserDocument)
    //this user object automatically gets attached to the request body as an attribute (because a Guard on top of the request calls the strategy)
    //therefore we have to use this function right here to retrieve that user object, therefore
    //the return type of this function is UserDocument
    //we have to retrieve the user after they authenticate because we have to use that user specific credentials
    //to interact with the database to retrieve user specific data

    //thats why below we are retrieving the user attribute from the request body
    return context.switchToHttp().getRequest().user;
}

export const CurrentUser = createParamDecorator(
    //by using this param decorator you can very easily get the user off of the request object
    (_data: unknown, context: ExecutionContext) => getCurrentUserByContext(context)
)