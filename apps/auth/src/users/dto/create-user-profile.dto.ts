import { IsEmail, IsNumber, IsString, IsStrongPassword } from "class-validator";

export class CreateUserProfileDto {

    @IsEmail()
    email:string;

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsString()
    gender: string;

    @IsString()
    dob: string;

    @IsNumber()
    phone: number;
    
}