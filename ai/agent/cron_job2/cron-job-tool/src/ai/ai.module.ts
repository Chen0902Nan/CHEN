import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { email, z } from 'zod';
import { tool } from '@langchain/core/tools';

@Module({
  imports: [UsersModule],
  controllers: [AiController],
  providers: [
    AiService,
    {
      provide: 'DB_USERS_CRUD_TOOL',
      useFactory: (UsersService: UsersService) => {
        const dbUsersCrudArgsSchema = z.object({
          // 枚举类型
          action: z
            .enum(['create', 'list', 'get', 'update', 'delete'])
            .describe('要执行的操作：create、list、get、update、delete、'),
          id: z
            .number()
            .int()
            .positive()
            .optional()
            .describe('用户ID(get、update、delete时要用)'),
          name: z
            .string()
            .min(1)
            .max(50)
            .optional()
            .describe('用户姓名(create/update时需要)'),
          email: z
            .string()
            .email()
            .max(50)
            .optional()
            .describe('用户邮箱(create/update时可用)'),
        });
        return tool(
          async ({
            action,
            id,
            name,
            email,
          }: {
            action: 'create' | 'get' | 'update' | 'delete' | 'list';
            id?: number;
            name?: string;
            email?: string;
          }) => {
            switch (action) {
              case 'create': {
                if (!name || !email) {
                  return '创建用户需要同时提供name和email';
                }
                const created = await UsersService.create({ name, email });
                return `已创建用户:ID=${created.id},
                姓名=${created.name},
                邮箱=${created.email}`;
              }
              case 'list': {
              }
              case 'get': {
              }
              case 'update': {
              }
              case 'delete': {
              }
              default:
                return `不支持的操作: ${action}`;
            }
          },
          {
            name: 'db_users_crud',
            description: `
            对数据库users 表执行增删改查操作。
            通过action字段选择 create/list/get/update/delete
            并按需提供id、email、name等参数
            `,
            schema: dbUsersCrudArgsSchema,
          },
        );
      },
    },
  ],
})
export class AiModule {}
