import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
//import { ConfigModule, ConfigService } from '@nestjs/config';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';

//import { ConfigService } from '@nestjs/config';

@Module({
  //if server is not connecting to the database, use 127.0.0.1 instead of localhost in the connection string
  //if it says mongoose module dependencies initialised it means we have successfully connected to our database
  //connection accepted will also be on mongodb logs

  //this is from forRootAsync method in the MongooseModule nestjs documentation
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        uri: config.get('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
  ],

  //custom config not used, as it is leading to errors

  // imports: [MongooseModule.forRootAsync({
  //     imports: [ConfigModule],
  //     useFactory: (configService: ConfigService)=> ({
  //         uri: configService.get('MONGODB_URI')
  //     }),
  //     inject:[ConfigService]
  // })]
})
export class DatabaseModule {
  static forFeature(models: ModelDefinition[]) {
    return MongooseModule.forFeature(models);
  }
}
