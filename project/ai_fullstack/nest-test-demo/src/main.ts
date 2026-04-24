import { NestFactory } from '@nestjs/core';
// 模块化
import { AppModule } from './app.module';
import { config } from 'dotenv';
config();
async function bootstrap() {
  // server app
  // 工厂模式 三星 -> 手机、汽车、方便面等
  // NestFactory nest 工厂
  // 根模型
  const app = await NestFactory.create(AppModule);
  // 3000 node 进程对象process
  // ?? 空值合并运算符 ES2020 ES11 处理null 和 undefined
  await app.listen(process.env.PORT ?? 3000);
  // await app.listen(process.env.PORT ?process.env.PORT: 3000);
}
bootstrap();
