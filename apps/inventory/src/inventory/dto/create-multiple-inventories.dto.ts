import { IsArray, IsBoolean, IsNotEmpty, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CreateInventoryDto } from "./create-inventory.dto";

export class CreateMultipleInventoriesDto {

@IsBoolean()
@IsNotEmpty()
reset: Boolean


@IsArray()
@ValidateNested({ each: true }) // Validate each item in the array
@Type(() => CreateInventoryDto)
inventories: CreateInventoryDto[]; // Array of CreateInventoryDto
}
