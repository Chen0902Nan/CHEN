import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';

// 设计模式 面向对象 企业级别开发 经验总结
// 23种常见的设计模式
// 工厂模式 单例模式 装饰器模式(类快速添加属性和方法)
// 观察者模式(IntersectionObserver) 代理模式(Proxy)
// 订阅发布者模式(关注  addEventListener)
@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
