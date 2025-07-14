import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {

    constructor(private readonly usersRepository: UsersRepository){

    }



    async create(createUserDto: CreateUserDto){
        //if you want to call methods from this class itself
        //to like using in another method (like right now) 
        //always use this keyword
        await this.validateCreateUserDto(createUserDto)
        return this.usersRepository.create({
            ...createUserDto,
            password: await bcrypt.hash(createUserDto.password,10)
        })
    }

    async validateCreateUserDto(createUserDto: CreateUserDto){
        try{
            //since the UsersRepository is injected into this class
            //you can use the this keyword to access its methods
            //make sure to remember input formats of methods like findOne
            //so that you can readily apply them when calling those methods
            await this.usersRepository.findOne({email: createUserDto.email})
        }catch(err){
            //i.e user does not exist, so he is allowed to proceed and create a new user
            return;
        }
        //like this pass in a message to any error that you want to display
        //it will display your message alongwith the error type and some more properties
        //related to that error
        throw new UnprocessableEntityException('Email already exists')
    }

    async verifyUser(email: string, password: string) {
        //first check of the user exists
        const user = await this.usersRepository.findOne({email});
        const passwordIsValid = await bcrypt.compare(password,user.password);
        if(!passwordIsValid){
            throw new UnauthorizedException("Credentials are not valid")
        }
        return user
    }

    async getUser(getUserDto: GetUserDto){
        return this.usersRepository.findOne(getUserDto)
    }


}


//if you want to add any addititonal functionality such as for example
//validating to check whether users with the same email exist and so you want to
//enforce uniqueness, you can do that in the users service file