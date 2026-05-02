import { Injectable, Inject } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EntityManager } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  @Inject(EntityManager)
  entityMannager: EntityManager;

  create(createUserDto: CreateUserDto) {
    return this.entityMannager.save(User, createUserDto);
  }

  findAll() {
    return this.entityMannager.find(User);
  }

  findOne(id: number) {
    return this.entityMannager.findOne(User, { where: { id } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.entityMannager.update(User, id, updateUserDto);
  }

  remove(id: number) {
    return this.entityMannager.delete(User, id);
  }
}
