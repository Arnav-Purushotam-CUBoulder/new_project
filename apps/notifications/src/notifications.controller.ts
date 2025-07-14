import { Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotifyEmailDto } from './dto/notify-email.dto';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UsePipes(new ValidationPipe())
  //this is the way to code for event style communication (which requires EventPattern) instead of request-response style (which requires message pattern)
  @EventPattern('notify_email')
  async notify_email(@Payload() data: NotifyEmailDto) {
    console.log("inside the notifications service")
    this.notificationsService.notifyEmail(data)

  }
}
