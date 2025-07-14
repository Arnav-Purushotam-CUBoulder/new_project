import { Type } from "class-transformer";
import { IsDate, IsDefined, IsNotEmpty, IsNotEmptyObject, IsNumber, IsString, ValidateNested } from "class-validator";
import { CreateChargeDto } from "@app/common";

export class CreateReservationDto{

    @IsDate()
    @Type(() => Date)
    startDate: Date;

    @IsDate()
    @Type(() => Date)
    endDate: Date;

    //place if also removed as it is not being used
    // @IsString()
    // @IsNotEmpty()
    // placeId: string;

    //removing user supplied invoice id here, as the invoice id has to be based on the stripe transaction
    // @IsString()
    // @IsNotEmpty()
    // invoiceId: string;

    @IsDefined()
    @IsNotEmptyObject()
    @ValidateNested()
    //type decorator in order to turn that object which we got into the type we want
    @Type(() => CreateChargeDto)
    charge: CreateChargeDto

}