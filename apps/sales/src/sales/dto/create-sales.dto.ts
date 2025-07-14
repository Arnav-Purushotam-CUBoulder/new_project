import { Type } from "class-transformer";
import { IsDate, IsDefined, IsNotEmpty, IsNotEmptyObject, IsNumber, IsString, ValidateNested } from "class-validator";
import { CreateChargeDto } from "@app/common";

export class CreateSalesDto{


    @IsString()
    @IsNotEmpty()
    customerName: string;

    @IsString()
    @IsNotEmpty()
    productName: string;

    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @IsDefined()
    @IsNotEmptyObject()
    @ValidateNested()
    //type decorator in order to turn that object which we got into the type we want
    @Type(() => CreateChargeDto)
    charge: CreateChargeDto

}