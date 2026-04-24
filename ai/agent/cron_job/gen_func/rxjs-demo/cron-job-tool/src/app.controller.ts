import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { AiService } from './ai/ai.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
