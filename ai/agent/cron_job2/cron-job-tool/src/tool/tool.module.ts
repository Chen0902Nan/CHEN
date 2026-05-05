import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { LlmService } from './llm.service';
import { WebSearchToolService } from './web-search-tool.service';
import { DbUsersCrudToolService } from './do-users-crud-tool.service';
import { UsersService } from 'src/users/users.service';
import { SendMailToolService } from './send-mail-tool.service';
import { TimeNowToolService } from './time-now-tool.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAIL_HOST'),
          port: Number(configService.get('MAIL_PORT')),
          secure: configService.get<string>('MAIL_SECURE') === 'true',
          auth: {
            user: configService.get('MAIL_USER'),
            pass: configService.get('MAIL_PASS'),
          },
        },
        defaults: {
          from: configService.get('MAIL_FROM'),
        },
      }),
    }),
  ],
  providers: [
    LlmService,
    WebSearchToolService,
    DbUsersCrudToolService,
    UsersService,
    SendMailToolService,
    TimeNowToolService,
    {
      provide: 'DB_USER_CRUD_TOOL',
      useFactory: (dbUesrsCrudToolService: DbUsersCrudToolService) =>
        dbUesrsCrudToolService.tool,
      inject: [DbUsersCrudToolService],
    },
    {
      provide: 'WEB_SEARCH_TOOL',
      useFactory: (webSearchToolService: WebSearchToolService) =>
        webSearchToolService.tool,
      inject: [WebSearchToolService],
    },
    {
      //自定义的注入项
      provide: 'CHAT_MODEL',
      useFactory: (llmService: LlmService) => llmService.getModel(),
      inject: [LlmService],
    },
    {
      provide: 'SEND_MAIL_TOOL',
      useFactory: (SendMailToolService: SendMailToolService) =>
        SendMailToolService.tool,
      inject: [SendMailToolService],
    },
    {
      provide: 'TIME_NOW_TOOL',
      useFactory: (timeNowToolService: TimeNowToolService) =>
        timeNowToolService.tool,
      inject: [TimeNowToolService],
    },
  ],
  exports: [
    'CHAT_MODEL',
    'WEB_SEARCH_TOOL',
    'DB_USER_CRUD_TOOL',
    'SEND_MAIL_TOOL',
    'TIME_NOW_TOOL'
  ],
})
export class ToolModule {}
