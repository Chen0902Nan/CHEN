import {
  Injectable,
  BadRequestException, // 错误处理
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

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
      throw new BadRequestException('用户名已存在');
    }
    return createUserDto;
  }
}
