import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
//restful
// method + URL(名词 可读性 直指资源)

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('login')
  @HttpCode(HttpStatus.OK) // 指定状态码为 200
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
