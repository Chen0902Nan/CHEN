import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AIService } from './ai.service';
import { ChatDto } from './dto/chat.dto';

@Controller('ai')
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Post('chat')
  async chat(@Body() chatDto: ChatDto, @Res() res: Response) {
    // console.log(chatDto);
    // return { chatDto };
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache'); // 每次llm 重新生成
    res.setHeader('Connection', 'keep-alive');
    try {
      await this.aiService.chat(chatDto.messages, (token: string) => {
        res.write(`0:${JSON.stringify(token)}\n`);
      });
      res.end();
    } catch (err) {
      console.error(err);

      res.status(500).end();
    }
  }
}
