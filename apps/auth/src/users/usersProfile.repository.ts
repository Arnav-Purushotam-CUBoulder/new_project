import { AbstractRepository, UserProfileDocument } from "@app/common";
import { Injectable, Logger } from "@nestjs/common";
import { UserDocument } from "@app/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class UsersProfileRepository extends AbstractRepository<UserProfileDocument> {
    protected readonly logger = new Logger(UsersProfileRepository.name);

    constructor(@InjectModel(UserProfileDocument.name) userProfileModel: Model<UserProfileDocument>){
        super(userProfileModel)
    }
}