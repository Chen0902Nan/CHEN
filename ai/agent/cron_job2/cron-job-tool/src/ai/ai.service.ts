import { Injectable, Inject } from '@nestjs/common';
import { Runnable } from '@langchain/core/runnables';
// 可运行对象
import {
  type AIMessageChunk,
  AIMessage,
  BaseMessage,
  HumanMessage,
  SystemMessage,
  ToolMessage,
} from '@langchain/core/messages';

import { ChatOpenAI } from '@langchain/openai';

@Injectable()
export class AiService {
  private readonly modelWithTools: Runnable<BaseMessage[], AIMessage>;
}
