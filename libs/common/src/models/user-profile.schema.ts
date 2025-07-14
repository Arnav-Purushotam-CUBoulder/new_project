import { AbstractDocument} from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class UserProfileDocument extends AbstractDocument{

    @Prop()
    firstName: string

    @Prop()
    lastName: string

    @Prop()
    gender: string

    @Prop()
    phone: number

    @Prop()
    dob: string

    @Prop()
    email: string

}

export const UserProfileSchema =
  SchemaFactory.createForClass(UserProfileDocument);
