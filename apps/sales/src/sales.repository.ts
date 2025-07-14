import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { SalesDocument } from './sales/models/sales.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SalesRepository extends AbstractRepository<SalesDocument> {
  protected readonly logger = new Logger(SalesRepository.name);

  constructor(
    @InjectModel(SalesDocument.name)
    salesModel: Model<SalesDocument>,
  ) {
    super(salesModel);
  }
}
