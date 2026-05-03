import { Module } from '@nestjs/common';
import { LlmService } from './llm.service';
import { WebSearchToolService } from './web-search-tool.service';
import { DbUsersCrudToolService } from './do-users-crud-tool.service';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
@Module({
    providers:[
        LlmService,
        WebSearchToolService,
        DbUsersCrudToolService,
        UsersService,
        {
            provide:'DB_USER_CRUD_TOOL',
            useFactory:(dbUesrsCrudToolService:DbUsersCrudToolService)=>dbUesrsCrudToolService.tool,
            inject:[DbUsersCrudToolService]
        },
        {
            provide:'WEB_SEARCH_TOOL',
            useFactory:(webSearchToolService:WebSearchToolService)=>webSearchToolService.tool,
            inject:[WebSearchToolService]
        },
        {//自定义的注入项
            provide:'CHAT_MODEL',
            useFactory:(llmService:LlmService)=>llmService.getModel(),
            inject:[LlmService]
        }
    ],
    exports:[
        'CHAT_MODEL',
        'WEB_SEARCH_TOOL',
        'DB_USER_CRUD_TOOL'
    ]
})
export class ToolModule {}
