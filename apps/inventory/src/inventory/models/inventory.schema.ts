import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class InventoryDocument extends AbstractDocument {
  @Prop()
  timestamp: Date;

  @Prop()
  productName: string;

  @Prop()
  Stock: number;

  @Prop()
  Threshold: number;

  @Prop()
  Cost: number;

  @Prop()
  invoiceId: string;
}

export const InventorySchema =
  SchemaFactory.createForClass(InventoryDocument);
