import { Type } from "class-transformer";
import { IsDate, IsDefined, IsNotEmpty, IsNotEmptyObject, IsNumber, IsString, ValidateNested } from "class-validator";
import { CreateChargeDto } from "@app/common";

export class CreateInventoryDto{



    @IsString()
    @IsNotEmpty()
    productName: string;

    @IsNumber()
    @IsNotEmpty()
    Stock: number;

    @IsNumber()
    @IsNotEmpty()
    Threshold: number;

    @IsNumber()
    @IsNotEmpty()
    Cost: number;



    @IsDefined()
    @IsNotEmptyObject()
    @ValidateNested()
    //type decorator in order to turn that object which we got into the type we want
    @Type(() => CreateChargeDto)
    charge: CreateChargeDto

}