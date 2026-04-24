import {
  Injectable,
  BadRequestException, // 错误处理
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable({})
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async register(createUserDto: CreateUserDto) {
    const { name, password } = createUserDto;
    // 验证user 是否唯一
    const existingUser = await this.prisma.user.findUnique({
      where: {
        name,
      },
    });
    if (existingUser) {
      // 抛出异常
      // nest 企业级 捕获并返回给用户错误信息
      // 弱类型 单线程  出错可能灾难性
      throw new BadRequestException('用户名已存在');
    }

    // 10 加密算法强度
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log(hashedPassword,hashedPassword.length)

    const user = await this.prisma.user.create({
      data: {
        name,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
      },
    });
    return user;
  }
}
