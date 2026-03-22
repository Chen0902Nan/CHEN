import { Injectable, Inject } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { Runnable } from '@langchain/core/runnables';
import {
  BaseMessage,
  AIMessage,
  HumanMessage,
  ToolMessage,
  SystemMessage,
  AIMessageChunk,
} from '@langchain/core/messages';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';

// 定义一个参数校验schema，这个参数是对象，这个对象一定有userId,且为string
const queryUserArgsSchema = z.object({
  userId: z.string().describe('用户ID, 例如: 001, 002, 003'),
});

type QueryUserArgs = {
  userId: string;
};

const database = {
  users: {
    '001': {
      id: '001',
      name: '张三',
      email: 'zhangsan@example.com',
      role: 'admin',
    },
    '002': { id: '002', name: '李四', email: 'lisi@example.com', role: 'user' },
    '003': {
      id: '003',
      name: '王五',
      email: 'wangwu@example.com',
      role: 'user',
    },
  },
};

const queryUserTool = tool(
  async ({ userId }: QueryUserArgs) => {
    const user = database.users[userId];
    if (!user) {
      return `用户ID ${userId} 不存在。可用的 ID: 001, 002, 003`;
    }
    return `用户信息：\n- ID: ${user.id}\n- 姓名: ${user.name}\n
        - 邮箱: ${user.email}\n- 角色: ${user.role}`;
  },
  {
    name: 'query_user',
    description:
      '查询数据库中的用户信息。输入用户ID， 返回该用户的详细信息(姓名、邮箱、角色)',
    schema: queryUserArgsSchema,
  },
);

@Injectable()
export class AiService {
  // Runnable 是langchain 中的一个接口，表示一个可运行的对象
  // BaseMessage[] 是langchain 中的一个基类，表示一个消息数组
  // AIMessage HumanMessage ToolMessage 是langchain 中的一个子类，表示一个消息
  // 输入的类型约束BaseMessage[]  输出的类型约束AIMessage
  private readonly modelWithTools: Runnable<BaseMessage[], AIMessage>;
  // 将llm 和业务逻辑分离  llm 变化太快
  // 注入了 provide 的model
  constructor(@Inject('CHAT_MODEL') model: ChatOpenAI) {
    // 可自动化调用工具的模型= 原模型 + 工具 通过bindTools，将工具绑定到模型上
    this.modelWithTools = model.bindTools([queryUserTool]);
  }
  // 同步调用 llm 完全生成后再返回
  // async runChain(query: string): Promise<string> {

  // }
  // 流式调用 llm 边生成边返回
  // generator 生成器函数
  async *runChainStream(query: string): AsyncIterable<string> {
    const messages: BaseMessage[] = [
      new SystemMessage(`你是一个智能助手, 可以在需要时调用工具(如 query_user)
            来查询用户信息，再用结果回答用户的问题。
        `),
      new HumanMessage(query),
    ];
    // agent loop
    while (true) {
      // .stream 流式生成 .invoke 一次性生成
      const stream = await this.modelWithTools.stream(messages);
      let fullAIMessage: AIMessageChunk | null = null;
      // as 类型断言
      for await (const chunk of stream as AsyncIterable<AIMessageChunk>) {
        // 判断当前是否是第一个chunk，如果是就使用chunk,否则将chunk加入fullAIMessage
        fullAIMessage = fullAIMessage ? fullAIMessage.concat(chunk) : chunk;
        // 判断是否存在工具调用
        const hasToolCallChunk =
          // !! 把任意值显示转成布尔值，第一个！转成布尔值，第二个！保留其原意的布尔值
          !!fullAIMessage.tool_call_chunks &&
          fullAIMessage.tool_call_chunks.length > 0;
        // 只有当前不是工具调用片段，且chunk中有内容时，才yield出去
        if (!hasToolCallChunk && chunk.content) {
          // 流式返回给前端
          yield chunk.content as string;
        }
      }

      if (!fullAIMessage) {
        return;
      }
      // stream , chunk 且不是tool yield 直接返回
      // stream 结束, 一条完整的AIMessage
      messages.push(fullAIMessage);
      // ?? 空值合并运算符 null和undefined才用右边的值
      const toolCalls = fullAIMessage.tool_calls ?? [];
      if (!toolCalls.length) {
        return;
      }
      for (const toolCall of toolCalls) {
        const toolCallId = toolCall.id || '';
        const toolName = toolCall.name;
        if (toolName === 'query_user') {
          // 先做参数校验
          const args = queryUserArgsSchema.parse(toolCall.args);
          const result = await queryUserTool.invoke(args);
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

// 同步调用 等到llm 完全生成
// async runChain(query: string): Promise<string> {
//   const response = await this.chatModel.invoke([new HumanMessage(query)]);

//   // 处理 content 类型：如果是字符串直接返回，否则拼接数组
//   if (typeof response.content === 'string') {
//     return response.content;
//   } else {
//     // 如果是数组，提取文本内容
//     return response.content.map(block =>
//       typeof block === 'string' ? block : (block as any).text || ''
//     ).join('');
//   }
// }
