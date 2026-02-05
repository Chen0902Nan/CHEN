import { Injectable } from '@nestjs/common';
import type { Message } from './dto/chat.dto';
import { ChatDeepSeek } from '@langchain/deepseek';
import {
  SystemMessage,
  HumanMessage,
  AIMessage,
} from '@langchain/core/messages';
import { OpenAIEmbeddings, DallEAPIWrapper } from '@langchain/openai';
import * as fs from 'fs/promises'; //promisify
import path from 'path';

interface Post {
  title: string;
  category: string;
  embedding: number[];
}

export function convertToLangChainMessages(
  messages: Message[],
): (HumanMessage | AIMessage | SystemMessage)[] {
  return messages.map((msg) => {
    switch (msg.role) {
      case 'user':
        return new HumanMessage(msg.content);
      case 'assistant':
        return new AIMessage(msg.content);
      case 'system':
        return new SystemMessage(msg.content);
      default:
        throw new Error(`Unsupported role: ${msg.role}`);
    }
  });
}

export function cosineSimilarity(v1: number[], v2: number[]): number {
  const dotProduct = v1.reduce((sum, val, i) => sum + val * v2[i], 0);
  const normV1 = Math.sqrt(v1.reduce((sum, val) => sum + val * val, 0));
  const normV2 = Math.sqrt(v2.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (normV1 * normV2);
}

@Injectable()
export class AIService {
  private posts: Post[] = [];
  private embeddings: OpenAIEmbeddings;
  private chatModel: ChatDeepSeek; // llm 成为service 一个私有属性
  private imageGenerator: DallEAPIWrapper;
  constructor() {
    this.chatModel = new ChatDeepSeek({
      configuration: {
        apiKey: process.env.DEEPSEEK_API_KEY,
        baseURL: process.env.DEEPSEEK_BASE_URL,
      },
      model: 'deepseek-chat',
      temperature: 0.7,
      streaming: true,
    });
    this.embeddings = new OpenAIEmbeddings({
      configuration: {
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: process.env.OPENAI_BASE_URL,
      },
      model: 'text-embedding-ada-002',
    });
    this.imageGenerator = new DallEAPIWrapper({
      openAIApiKey: process.env.OPENAI_API_KEY,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
    });
    this.loadPosts();
  }

  // 封装类的实现细节，复杂性
  private async loadPosts() {
    try {
      console.log(__dirname, '//////?????');
      // nestjs compile ts -> js  dist
      // nest-cli assets data/**/*/  dist/
      const filePath = path.join(
        __dirname,
        '../../',
        'data',
        'posts-embedding.json',
      );
      const data = await fs.readFile(filePath, 'utf-8');
      // console.log(data, "?????");
      this.posts = JSON.parse(data);
    } catch (err) {
      console.error('Failed to load posts', err);
      this.posts = [];
    }
  }

  async chat(messages: Message[], onToken: (token: string) => void) {
    const langChainMessages = convertToLangChainMessages(messages);
    // console.log(langChainMessages, this.chatModel,'/////');
    const stream = await this.chatModel.stream(langChainMessages);
    console.log(stream, '//////');
    for await (const chunk of stream) {
      const content = chunk.content as string; // 断言
      // console.log(content, "//////");
      // 用模块化， 回调传递
      if (content) {
        onToken(content);
      }
    }
  }

  async search(keyword: string, topK = 3) {
    const vector = await this.embeddings.embedQuery(keyword);
    // console.log(vector, '/////')
    const results = this.posts
      .map((post) => ({
        ...post,
        similarity: cosineSimilarity(vector, post.embedding),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK)
      .map((item) => item.title);

    return {
      code: 0, // 没有任何错误
      data: results,
    };
  }

  async avatar(name: string) {
    const imgUrl = await this.imageGenerator.invoke(`
    你是一位头像设计师，
    根据用户的姓名${name},
    设计一个专业的头像。
    风格卡通，时尚，好看。  
    `);
    console.log(imgUrl);
    return imgUrl;
  }

  async rag(question: string) {
    
  }
}
