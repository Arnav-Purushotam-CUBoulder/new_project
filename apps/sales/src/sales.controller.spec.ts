import { Test, TestingModule } from '@nestjs/testing';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';

describe('SalesController', () => {
  let salesController: SalesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SalesController],
      providers: [SalesService],
    }).compile();

    salesController = app.get<SalesController>(SalesController);
  });

  // describe('root', () => {
  //   it('should return "Hello World!"', () => {
  //     expect(salesController.getHello()).toBe('Hello World!');
  //   });
  // });
});
