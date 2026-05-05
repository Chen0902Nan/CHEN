import { Injectable, Inject } from '@nestjs/common';
//可运行对象
import { Runnable } from '@langchain/core/runnables';
import {
  type AIMessageChunk,
  AIMessage,
  BaseMessage,
  HumanMessage,
  SystemMessage,
  ToolMessage,
} from '@langchain/core/messages';

import { ChatOpenAI } from '@langchain/openai';
import { StructuredTool } from '@langchain/core/tools';

@Injectable()
export class AiService {
  private readonly modelWithTools!: Runnable<BaseMessage[], AIMessage>;
  constructor(
    @Inject('CHAT_MODEL') model: ChatOpenAI,
    @Inject('WEB_SEARCH_TOOL') private readonly webSearchTool: StructuredTool,
    @Inject('DB_USER_CRUD_TOOL')
    private readonly dbUsersCrudTool: StructuredTool,
    @Inject('SEND_MAIL_TOOL') private readonly sendMailTool: StructuredTool,
    @Inject('TIME_NOW_TOOL') private readonly timeNowTool: StructuredTool,
  ) {
    this.modelWithTools = model.bindTools([
      this.webSearchTool,
      this.dbUsersCrudTool,
      this.sendMailTool,
      this.timeNowTool,
    ]);
  }

  async *runChainStream(query: string): AsyncIterable<string> {
    const messages: BaseMessage[] = [
      new SystemMessage(
        `你是一个通用任务助手，可以根据用户的目标规划步骤，并在需要时调用工具：\`db_users_crud\`（用户
         +数据库增删改查）、\`send_mail\`（发送邮件）、\`time_now\`（获取当前时间）、\`web_search\`（网页搜索）`,
      ),
      new HumanMessage(query),
    ];
    while (true) {
      const stream = await this.modelWithTools.stream(messages);
      let fullAiMessage: AIMessageChunk | null = null;
      for await (const chunks of stream as AsyncIterable<AIMessageChunk>) {
        fullAiMessage = fullAiMessage ? fullAiMessage.concat(chunks) : chunks;
        //判断是否存在工具调用
        //!! 双重否定就是肯定
        //一定是boolean类型
        const hasToolCallChunk =
          !!fullAiMessage.tool_call_chunks &&
          fullAiMessage.tool_call_chunks.length > 0;

        if (!hasToolCallChunk && chunks.content) {
          yield chunks.content as string;
        }
      }
      if (!fullAiMessage) {
        return;
      }

      messages.push(fullAiMessage);
      const toolCalls = fullAiMessage.tool_calls ?? [];
      if (!toolCalls.length) {
        return;
      }

      for (const toolCall of toolCalls) {
        const toolCallId = toolCall.id || '';
        const toolName = toolCall.name;
        if (toolName === 'db_users_crud') {
          const result = await this.dbUsersCrudTool.invoke(toolCall.args);
          messages.push(
            new ToolMessage({
              content: result,
              name: toolName,
              tool_call_id: toolCallId,
            }),
          );
        } else if (toolName === 'send_mail') {
          const result = await this.sendMailTool.invoke(toolCall.args);
          messages.push(
            new ToolMessage({
              content: result,
              name: toolName,
              tool_call_id: toolCallId,
            }),
          );
        } else if (toolName === 'time_now') {
          const result = await this.timeNowTool.invoke({});
          messages.push(
            new ToolMessage({
              content: result,
              name: toolName,
              tool_call_id: toolCallId,
            }),
          );
        }
      }
    }
  }
}
