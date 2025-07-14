import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InventoryDocument } from './inventory/models/inventory.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class InventoryRepository extends AbstractRepository<InventoryDocument> {
  protected readonly logger = new Logger(InventoryRepository.name);

  constructor(
    @InjectModel(InventoryDocument.name)
    inventoryModel: Model<InventoryDocument>,
  ) {
    super(inventoryModel);
  }
}
