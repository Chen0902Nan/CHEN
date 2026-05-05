import { forwardRef, Module } from '@nestjs/common';
import { JobService } from './job.service';
import { ToolModule } from 'src/tool/tool.module';

@Module({
  // forwardRef 延迟引用 解决循环依赖
  imports:[forwardRef(()=>ToolModule)],
  providers: [JobService],
  exports:[JobService]
})
export class JobModule {}
