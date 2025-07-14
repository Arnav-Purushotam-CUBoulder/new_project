//remember how i made wrote dto code
//first create a dto folder inside the src folder of the microservice
//then create the file in the name format: dto-name.dto.ts
//see how i am constructing the dto, it should have as properties the input of the corresponding service function which handles this particular payload
//that is why i copied the arguments from that particular createCharge method and pasted them as properties under this class
//class names should always start with capital letters and continue in camel case

import Stripe from "stripe"
import { CardDto } from "./card.dto"
import { IsDefined, IsNotEmptyObject, IsNumber, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

//this is nested DTOs, remember how to do this
//cardDto is nested in the CreateChargeDto (check the nestjs temporary code store, to see how to write the body object for such a dto in postman)
export class CreateChargeDto {
    @IsDefined()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => CardDto)
    card: CardDto;

    @IsNumber()
    amount: number

}