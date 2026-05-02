import { Module, OnApplicationBootstrap, Inject } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { AiModule } from './ai/ai.module';
// 定时任务
import { CronJob } from 'cron';
// nestjs 定时任务
import {
  CronExpression, // 定时时间表达式
  ScheduleModule, // 定时任务模块
  SchedulerRegistry, // 定时任务注册表
} from '@nestjs/schedule';
import { JobModule } from './job/job.module';
import { Job } from './job/entities/job.entities';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Chen0902',
      database: 'hello',
      synchronize: true, // 自动同步数据库
      connectorPackage: 'mysql2',
      logging: true,
      entities: [User, Job],
    }),
    UsersModule,
    AiModule,
    ScheduleModule.forRoot(),
    JobModule,
  ],
  controllers: [AppController],
  providers: [AppService],
}) // 强制类必须实现接口里规定的方法
export class AppModule implements OnApplicationBootstrap {
  @Inject(SchedulerRegistry)
  schedulerRegistry: SchedulerRegistry;

  async onApplicationBootstrap() {
    // console.log('init');
    // const job = new CronJob(CronExpression.EVERY_SECOND, () => {});
    // this.schedulerRegistry.addCronJob('job1', job);
    // job.start();
    // setTimeout(() => {
    //   this.schedulerRegistry.getCronJob('job1').stop();
    // }, 5000);
    // const intervalRef = setInterval(() => {
    //   console.log('run interval job');
    // }, 1000);
    // this.schedulerRegistry.addInterval('interval1', intervalRef);
    // setTimeout(() => {
    //   this.schedulerRegistry.deleteInterval('interval1');
    // }, 5000);
    // const timeoutRef = setTimeout(() => {
    //   console.log('run timeout job');
    // }, 3000);
    // this.schedulerRegistry.addTimeout('timeout1', timeoutRef);
    // setTimeout(() => {
    //   this.schedulerRegistry.deleteTimeout('timeout1');
    // }, 5000);
  }
}
