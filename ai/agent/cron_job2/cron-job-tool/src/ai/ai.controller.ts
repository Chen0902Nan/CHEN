import { Controller,Sse,Query } from '@nestjs/common';
import { AiService } from './ai.service';
//rxjs 流式响应
import { Observable,from } from 'rxjs';
//map 映射
import { map } from 'rxjs';
import strict from 'assert/strict';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Sse('chat/stream')
  chatStream(@Query('query') query:string):Observable<MessageEvent>{
    const stream=this.aiService.runChainStream(query);
    return from(stream)
    .pipe(map((chunk)=>({
      data:chunk
    }))) as Observable<MessageEvent>
  }
}
