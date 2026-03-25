import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { ChatOpenAI } from '@langchain/openai';
import { ConfigService } from '@nestjs/config';
import { UserService } from './user.service';
import { z } from 'zod';
import { tool } from '@langchain/core/tools';
import { MailerService } from '@nestjs-modules/mailer';

@Module({
  controllers: [AiController],
  providers: [
    AiService,
    UserService,
    // provide 动态创建的
    // 将model 丛逻辑中剥离出来
    // llm 作为provide 提供
    {
      provide: 'CHAT_MODEL',
      // 工厂模式，车，摩托车， 坦克....
      useFactory: (configService: ConfigService) => {
        return new ChatOpenAI({
          model: configService.get('MODEL_NAME'),
          apiKey: configService.get('OPENAI_API_KEY'),
          configuration: {
            baseURL: configService.get('OPENAI_BASE_URL'),
          },
        });
      },
      inject: [ConfigService],
    },
    // 用户查询
    {
      provide: 'QUERY_USER_TOOL',
      useFactory: (userService: UserService) => {
        const queryUserArgsSchema = z.object({
          userId: z.string().describe('用户ID,例如： 001， 002， 003'),
        });
        return tool(
          async ({ userId }: { userId: string }) => {
            const user = userService.findOne(userId);
            if (!user) {
              const availableIds = userService
                .findAll()
                .map((u) => u.id)
                .join(', ');
              return `用户${userId}不存在。可用的ID: ${availableIds}`;
            }
            return `用户信息：\n- ID: ${user.id} \n- 姓名：${user.name}
                    \n- 邮箱: ${user.email}\n- 角色 ${user.role}
                    `;
          },
          {
            name: 'query_user',
            description: `查询数据库中的用户信息。输入用户ID，
                    返回该用户的详细信息（姓名、邮箱、角色）`,
            schema: queryUserArgsSchema,
          },
        );
      },
      inject: [UserService],
    },
    // 邮件发送
    {
      provide: 'SEND_MAIL_TOOL',
      useFactory: (
        mailerService: MailerService,
        configService: ConfigService,
      ) => {
        // zod 是大模型tool工作的宝藏
        const sendMailArgsSchema = z.object({
          to: z.email().describe('收件人邮箱地址，例如：test@example.com'),
          subject: z.string().describe('邮件主题'),
          text: z.string().describe('纯文本内容，可选'),
          html: z.string().describe('HTML 内容，可选'),
        });
        return tool(
          async ({
            to,
            subject,
            text,
            html,
          }: {
            to: string;
            subject: string;
            text?: string;
            html?: string;
          }) => {
            const fallbackForm = configService.get<string>('MAIL_FROM');
            await mailerService.sendMail({
              to,
              subject,
              text: text ?? '(无文本内容)',
              html: html ?? `<p>${text ?? '(无HTML内容'}</p>`,
              from: fallbackForm,
            });
            return `邮件发送成功，收件人：${to}，主题：${subject}`;
          },
          {
            name: 'sendMailTool',
            description:
              '发送电子邮件，需要提供收件人邮箱，邮件主题，可选文本内容和HTML内容',
            schema: sendMailArgsSchema,
          },
        );
      },
      inject: [MailerService, ConfigService],
    },
    // 浏览器查询
    {
      provide: 'WEB_SEARCH_TOOL',
      useFactory: (configService: ConfigService) => {
        const webSearchArgsSchema = z.object({
          query: z
            .string()
            .min(1)
            .describe('搜索关键字，例如：公司年报，某个事件等'),
          count: z
            .number()
            .int()
            .min(1)
            .max(20)
            .optional()
            .describe('返回搜索结果数量，默认10条'),
        });
        return tool(
          async ({ query, count }: { query: string; count: number }) => {
            const apiKey = configService.get<string>('BOCHA_API_KEY');
            if (!apiKey) {
              return 'Bocha API 秘钥';
            }

            const url = 'https://api.bocha.cn/v1/web-search';
            const body = {
              query,
              freshness: 'noLimit',
              summary: 'true',
              count: count ?? 10,
            };
            const response = await fetch(url, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': `application/json`,
              },
              body: JSON.stringify(body),
            });
            if (!response.ok) {
              const errorText = await response.text();
              return `搜索API 请求失败，状态码：${response.status},错误信息：${errorText}`;
            }
            let json: any;
            try {
              json = await response.json();
            } catch (error) {
              return '搜索API 请求失败';
            }
            try {
              if (json.code !== 200 || !json.data) {
                return `搜索 API 请求失败，原因是: ${json.msg ?? '未知错误'}`;
              }

              const webpages = json.data.webPages?.value ?? [];
              if (!webpages.length) {
                return '未找到相关结果。';
              }

              const formatted = webpages
                .map(
                  (page: any, idx: number) =>
                    `引用: ${idx + 1}
                  标题: ${page.name}
                  URL: ${page.url}
                  摘要: ${page.summary}
                  网站名称: ${page.siteName}
                  网站图标: ${page.siteIcon}
                  发布时间: ${page.dateLastCrawled}`,
                )
                .join('\n\n');

              return formatted;
            } catch (e) {
              return `搜索 API 请求失败，原因是：搜索结果解析失败 ${(e as Error).message}`;
            }
          },
          {
            name: 'webSearchTool',
            description: `使用Bocha Web Search API 搜索互联网网页。输入为搜索关键词
          (可选count：指定结果数量，返回包含标题，URL，摘要，网站名称，图标和时间等信息的结果列表)`,
            schema: webSearchArgsSchema,
          },
        );
      },
      inject: [ConfigService],
    },
  ],
})
export class AiModule {}
