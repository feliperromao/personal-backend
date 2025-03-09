import { Controller, Get } from "@nestjs/common";

@Controller('/')
export class AppController {
  @Get('/')
  getHello(): any {
    return {"status": "running", "message": "It's work"};
  }
}