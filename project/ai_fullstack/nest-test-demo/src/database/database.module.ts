import { Module,Global } from '@nestjs/common';
// 数据库驱动
import { Pool } from 'pg'
import * as dotenv from 'dotenv'
// 数据库基础服务
dotenv.config()
@Global()// 全局服务

@Module({
  providers: [
    {
      provide: 'PG_CONNECTION',
      // 数据库连接池
      useValue: new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT || '5432'),
      }),
    },
  ],
  exports: ['PG_CONNECTION'],
})
export class DatabaseModule {}
