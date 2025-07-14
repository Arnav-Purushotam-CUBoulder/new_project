import { Controller, Get } from "@nestjs/common";

@Controller('/')
export class HealthController {
    @Get()
    health() {
        console.log("health check successful")
        return true
    }
}