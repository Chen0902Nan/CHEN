import { Controller, Get, Query, Sse } from '@nestjs/common';
import { AiService } from './ai.service';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { MessageEvent } from '@nestjs/common';

@Controller('ai')
export class AiController {
  // 依赖注入
  constructor(private readonly aiService: AiService) {}
  // Serve Send Event 本质是添加了以下的响应头
  // Content-Type: text/event-stream
  // Cache-Control:no-cache 别缓存
  // Connection:keep-alive 保持连接 长连接
  // Transfer-Encoding:chunked 分块传输
  // 装饰器模式：经典的面向对象设计模式之一
  @Sse('chat/stream')
  chatStream(@Query('query') query: string): Observable<MessageEvent> {
    const stream = this.aiService.runChainStream(query);
    // return 的时候，首先发送的是 sse 的响应头
    // from 把 llm 的 stream 转换为 observable 对象
    // observable 对象每收到一段service提供的chunk，就next一次
    // map
    return from(stream).pipe(
      map((chunk) => ({
        // 前端需要的 chunk 的一个格式约定
        data: chunk,
      })),
    ) as Observable<MessageEvent>;
  }
}
