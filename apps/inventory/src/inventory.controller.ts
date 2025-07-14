






import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto, UpdateInventoryDto } from './inventory/dto'
//@app/common is just a short form for the libs/common folder where all of our common code is located
import { CurrentUser, JwtAuthGuard, UserDto } from '@app/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreateMultipleInventoriesDto } from './inventory/dto/create-multiple-inventories.dto';



















//when you make a request and it succeeds, but after sometime the same request fails
//it maybe that the jwt token has expired, in that case, you will have to login again to recieve a new jwt token








@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}


  //make sure not to miss the async and await keywords where ever required
  //as you can observe below, we can pass in multiple decorators directly into the arguments of any method
  //here a method of a controller route, this allows us to get access to the stuff that we want in a very clean manner
  //like the user object of the current request for example
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createMultipleInventoriesDto: CreateMultipleInventoriesDto, @CurrentUser() user: UserDto ) {
    //the user type didnt exist, so i made a dto for it called the UserDto, remember this method for creating new types
    
    // const _user =  await this.inventoryService.create(createInventoryDto,user);
    // console.log(user)
    // return _user;

    // Check if reset flag is set
    if (createMultipleInventoriesDto.reset) {
      console.log('Reset flag is set. Deleting all existing inventories.');

      // Find all existing inventories
      const allInventories = await this.inventoryService.findAll();
      console.log(`Found ${allInventories.length} inventories to delete.`);

      // Remove each inventory by ID
      for (const inventory of allInventories) {
        await this.inventoryService.remove(inventory._id.toString()); // Assuming each inventory has an `id` field
      }
      console.log('All inventories deleted.');
    }



  
    const results = []; // To store the results for each inventory object

    for (const inventoryDto of createMultipleInventoriesDto.inventories) {
      // Call the service for each inventory object
      const result = await this.inventoryService.create(inventoryDto, user);
      console.log(result)
      results.push(result);
    }

    console.log(user);
    console.log(results)

    return {
      message: 'Inventories processed successfully',
      results,
    };
  }






  


  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.inventoryService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ) {
    return this.inventoryService.update(id, updateInventoryDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.inventoryService.remove(id);
  }



//this is the way to code for event style communication (which requires EventPattern) instead of request-response style (which requires message pattern)
@EventPattern('update_inventory_due_to_sales')
async update_inventory_due_to_sales(@Payload() data: any) {
  console.log("inside the inventory service, after being called by the sales service")
  //here you can use the inventory service methods

  //here data.id is the id of the product type and not the id of the sales transaction
  //now the data from the sales service cannot provide you the id of the product type
  //it will only provide you the name of the product type
  //so use that name to query the database and get the id of the product type
  //you can do this by getting all the product types from the database and then using a forloop to go through them
  //match the name then get the id from that
  //also just take the stock and productName from the incoming dto, create a new dto from that
  //and then use it to update the database as threshold and cost value is 0 in the incoming dto as they are not being used

  const productName = data.productName
  const subtractStock = data.Stock
  const allProducts = await this.inventoryService.findAll()
  // Find the product with the matching productName
  const product = allProducts.find(product => product.productName === productName);
  // Extract the product ID and current stock
  const productId = product._id; 
  const currentStock = product.Stock;
  const threshold = product.Threshold;
  const cost = product.Cost;

  // Calculate the new stock value
  const newStock = currentStock - subtractStock;

    
  const updatedInventoryDetail: UpdateInventoryDto = {
      Stock: newStock,
      productName: product.productName, // Ensure you include necessary fields for the update,
      Threshold: threshold,
      Cost: cost,

    };

  console.log("DID LOGIC TO UPDATE INVENTORY")


  this.inventoryService.update(productId.toString(), updatedInventoryDetail)
  console.log("UPDATED INVENTORY DUE TO SALES")

  

}




}




//on first applying the authGuard, you will get this error:
//ERROR [ExceptionHandler] Nest can't resolve dependencies of the JwtAuthGuard (?). 
//Please make sure that the argument "auth" at index [0] is available in the ReservationsModule context.
//reservations-1 
//this happens because you havemt provided the AUTH_SERVICE injection token  (from the jwt-auth.guard.ts file in the libs/common) in the reservations service
//where we are trying to use it
//therefore you have to register this service and provide the injection token (check the reservations module for how it is implemented)