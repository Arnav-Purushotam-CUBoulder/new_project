import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersProfileRepository } from './usersProfile.repository';
import * as bcrypt from 'bcryptjs';
import { GetUserDto } from './dto/get-user.dto';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { GetUserProfileDto } from './dto/get-user-profile.dto';

@Injectable()
export class UsersProfileService {

    constructor(private readonly usersProfileRepository: UsersProfileRepository){

    }



    async createProfile(createUserProfileDto: CreateUserProfileDto){
        //if you want to call methods from this class itself
        //to like using in another method (like right now) 
        //always use this keyword
        await this.validateCreateUserProfileDto(createUserProfileDto)
        return this.usersProfileRepository.create({
            ...createUserProfileDto,
            
        })
    }

    async validateCreateUserProfileDto(createUserProfileDto: CreateUserProfileDto){
        try{
            //since the UsersProfileRepository is injected into this class
            //you can use the this keyword to access its methods
            //make sure to remember input formats of methods like findOne
            //so that you can readily apply them when calling those methods
            await this.usersProfileRepository.findOne({email: createUserProfileDto.email})
        }catch(err){
            //i.e user profile does not exist, so he is allowed to proceed and create a new user profile
            return;
        }
        //like this pass in a message to any error that you want to display
        //it will display your message alongwith the error type and some more properties
        //related to that error
        throw new UnprocessableEntityException('User Profile already exists')
    }

    async getUserProfile(getUserProfileDto: GetUserProfileDto){
        return this.usersProfileRepository.findOne({"email":getUserProfileDto.email})
    }

    // async verifyUser(email: string, password: string) {
    //     //first check of the user exists
    //     const user = await this.usersProfileRepository.findOne({email});
    //     const passwordIsValid = await bcrypt.compare(password,user.password);
    //     if(!passwordIsValid){
    //         throw new UnauthorizedException("Credentials are not valid")
    //     }
    //     return user
    // }

    // async getUserProfile(getUserProfileDto: GetUserProfileDto){
    //     return this.usersProfileRepository.findOne(getUserProfileDto)
    // }


}


//if you want to add any addititonal functionality such as for example
//validating to check whether usersProfile with the same email exist and so you want to
//enforce uniqueness, you can do that in the usersProfile service file