import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class SalesDocument extends AbstractDocument {
  @Prop()
  timestamp: Date;

  @Prop()
  customerName: string;

  @Prop()
  productName: string;

  @Prop()
  quantity: number;

  @Prop()
  userId: string;

  @Prop()
  invoiceId: string;
}

export const SalesSchema =
  SchemaFactory.createForClass(SalesDocument);
