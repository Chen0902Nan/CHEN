import { Module } from '@nestjs/common';
import { TodoController } from './todos.controller';
import { TodosService } from './todos.service';

@Module({
  controllers: [TodoController],
  providers: [TodosService],
})
export class TodosModule {}
