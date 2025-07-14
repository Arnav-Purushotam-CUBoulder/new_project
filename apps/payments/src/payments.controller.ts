import { Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateChargeDto } from '@app/common';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  //after writing code for a microservice, you will need to expose it as a microservice
  //for that you can remember the methodology used below
  //(method and route names start with lower case letter and then continue as camel case)
  //messagePattern decorator Subscribes to incoming messages which fulfils a chosen pattern
  //like below you can extract the payload using a decorator inside the arguments, (i called it data here) (remember this method and syntax to extract the payload from any route)
  //you can use MessagePattern like this, to expose the microservice i.e. for interservice microservice communication
  //but you must also create a dto for that particular message pattern
  //the data payload will obv be of the type CreateChargeDto
  //the dto itself is nothing but a class, but payloads from routes are handled this way in order to make it more organised and reduce confusion
  @MessagePattern('create_charge')
  //this below pipes code automatically validates all the data on the incoming payload
  //i.e. instead of the reservation service sending the charge, if it sends something else, then an error will be raised
  @UsePipes(new ValidationPipe())
  async createCharge(@Payload() data: PaymentsCreateChargeDto) {
    //after extracting the payload above, i just directly pass it to the corresponding method (which takes in the dto class type as input itself)
    //this pattern of coding is important to remember in nestjs::  create_logic_method_in_service_file ---> write_the_route_in_controller ---> create_corresponding_dto_if_required ---> edit_route_and_service_method_to_take_as_input_the_dto
    return this.paymentsService.createCharge(data);

  }

  
}
