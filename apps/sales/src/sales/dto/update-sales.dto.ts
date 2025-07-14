
import { PartialType } from "@nestjs/mapped-types";
import { CreateSalesDto } from "./create-sales.dto";

export class UpdateSalesDto extends PartialType(CreateSalesDto){}