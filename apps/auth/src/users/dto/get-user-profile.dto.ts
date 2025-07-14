import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class GetUserProfileDto {

    @IsEmail()
    @IsNotEmpty()
    email: string;
}