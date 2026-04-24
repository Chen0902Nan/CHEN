// 依赖注入
import { Injectable } from '@nestjs/common';
// controller 服务于路由 树根
// service 店里的厨师 Injectable 被注入
@Injectable()
export class AppService {
  getHello(): string {
    return '扣你鸡哇';
  }

  getWelcome(): string {
    return 'Welcome to nestjs';
  }

  handleLogin(username: string, password: string) {
    if (username === 'admin' && password === '123456') {
      return {
        status: 200,
        message: '登陆成功',
      };
    } else {
      return {
        status: 400,
        message: '登陆失败',
      };
    }
  }
}
