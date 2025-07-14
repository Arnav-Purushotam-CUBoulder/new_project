import { IsArray, IsBoolean, IsNotEmpty, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CreateSalesDto } from "./create-sales.dto";

export class CreateMultipleSalesDto {

@IsBoolean()
@IsNotEmpty()
reset: Boolean


@IsArray()
@ValidateNested({ each: true }) // Validate each item in the array
@Type(() => CreateSalesDto)
sales_array: CreateSalesDto[]; // Array of CreateSalesDto
}
