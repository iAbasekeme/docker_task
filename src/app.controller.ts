import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './application/authentication/decorators/public.decorator';

@Controller()
@Public()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  index() {
    return this.appService.index();
  }
}
