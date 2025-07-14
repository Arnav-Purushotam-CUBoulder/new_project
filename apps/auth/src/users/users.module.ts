import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule, UserProfileDocument, UserProfileSchema } from '@app/common';
import { UserDocument, UserSchema } from '@app/common';
import { UsersRepository } from './users.repository';
import { UsersProfileRepository } from './usersProfile.repository';
import { UsersProfileService } from './usersProfile.service';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
    ]),
    DatabaseModule.forFeature([
      { name: UserProfileDocument.name, schema: UserProfileSchema },
    ]),],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UsersProfileRepository, UsersProfileService],
  //make sure to specify the exports clearly, i.e. stuff from this module which will be used as injectables in other places
  //otherwise this can lead to intermittent errors, where packages that use them as injectables cant recognise them,. because
  //they weren't exported from here
  exports: [UsersService,UsersProfileService]
})
export class UsersModule {}
