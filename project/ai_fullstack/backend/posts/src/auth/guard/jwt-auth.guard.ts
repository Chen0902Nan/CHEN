import { Injectable } from '@nestjs/common';
//  默认提供的guard  自动解析req Authorization
import { AuthGuard } from '@nestjs/passport';
// req header Authorization
// 关注的是 access_token
// @nestjs/jwt verify
// service 看待 可以依赖注入，注入到任何需要使用鉴权的路由中去

// 继承 AuthGuard 基类
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
