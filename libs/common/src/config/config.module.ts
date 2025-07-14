// import { Module } from '@nestjs/common';
// import {ConfigService, ConfigModule as NestConfigModule} from '@nestjs/config'
// //if import Joi from 'joi' causes an error, use like below
// import * as Joi from 'joi';

//here as you can see, we are validating all environment variables of all microservices
//in a single file, but the .env files itself, there is each one for a given microservice
//so we have to do validation also similarly, so comment out this file

// @Module({
//     imports:[NestConfigModule.forRoot({
//         validationSchema: Joi.object({
//             MONGODB_URI: Joi.string().required()
//         })
//     }

//     )],
//     providers: [ConfigService],
//     exports: [ConfigService],
// })
// export class ConfigModule {}

//NestCongigModule instead of ConfigModule so as to not collide with t
//our module also named ConfigModule
//we are wrapping these 3rd party dependancies inside a module we created
//so whenever we want to change the underlying dependencies, we can simply come to
//one place which is here
//.forRoot() tells the config module to read any environment variables we might have in memory
//and also to read any .env files in our directory

//validation schema to ensure that we throw an error when the required env variables
//are not available on startup

//put this inside for root to access additional functionality
// {
//     validationSchema: Joi.object({
//         //now specify the env variables which are required
//         //meaning the value has to be a string, and it is required
//         MONGODB_URI: Joi.string().required()

//     })
// }
