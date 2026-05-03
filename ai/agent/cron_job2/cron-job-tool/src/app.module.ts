import { Inject, Module,OnApplicationBootstrap } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from '@nestjs/typeorm'
import { UsersModule } from './users/users.module';
import {User} from './users/entities/user.entity'
import { AiModule } from './ai/ai.module';
//定时任务
import {CronJob} from 'cron';
//nestjs 定时任务
import {CronExpression,//定时时间表达式
  ScheduleModule,//定时任务模块
  SchedulerRegistry//
} from '@nestjs/schedule'
import { JobModule } from './job/job.module';
import { Job } from './job/entities/job.entity';
import { ToolModule } from './tool/tool.module';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import {ServeStaticModule} from '@nestjs/serve-static'
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath:join(__dirname,'..','public')
    }),
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath:'.env'
    }),
    MailerModule.forRootAsync({ 
      inject:[ConfigService],
      useFactory:(configService:ConfigService)=>({
        transport:{
          host: configService.get('MAIL_HOST'),
                port: Number(configService.get('MAIL_PORT')),
                secure: configService.get<string>('MAIL_SECURE') === 'true',
                auth: {
                    user: configService.get('MAIL_USER'),
                    pass: configService.get('MAIL_PASS')
                }
            },
            defaults: {
                from: configService.get('MAIL_FROM')
            }
        }
     ),
    }),
    TypeOrmModule.forRootAsync({
      inject:[ConfigService],
      useFactory:(configService:ConfigService)=>({
        type:'mysql',
        host:configService.get('MYSQL_HOST','localhost'),
        port:configService.get<number>('MYSQL_PORT',3306),
        username:configService.get('MYSQL_USERNAME','root'),
        password:configService.get('MYSQL_PASSWORD',''),
        database:configService.get('MYSQL_DATABASE','hello'),
        synchronize:true,
        connectorPackage:'mysql2',
        logging:true,
        entities:[User,Job]
      })
    }),
    UsersModule,
    AiModule,
    ScheduleModule.forRoot(),
    JobModule,
    ToolModule
  ],
  controllers: [AppController],
  providers: [
    
    AppService],
})
//强制类必须实现接口里定义的方法
export class AppModule implements OnApplicationBootstrap {
  @Inject(SchedulerRegistry)
  schedulerRegistry!:SchedulerRegistry
  async onApplicationBootstrap() {
      // console.log('init');
      // const job=new CronJob(CronExpression.EVERY_10_SECONDS,()=>{
      //   console.log('run job');
        
      // });

      // this.schedulerRegistry.addCronJob('job1',job);
      // job.start();
      // setTimeout(()=>{
      //   this.schedulerRegistry.getCronJob('job1').stop()
      // },5000);

      // const intervalRef=setInterval(()=>{
      //   console.log('run cron job');
        
      // },1000);

      // this.schedulerRegistry.addInterval('interval1',intervalRef);
      // setTimeout(() => {
      //   this.schedulerRegistry.deleteInterval('interval1')
      // }, 5000);

      // const timeoutRef=setTimeout(()=>{
      //   console.log('run timeout job');
        
      // },3000);
      
      // this.schedulerRegistry.addTimeout('timeout1',timeoutRef);
      // setTimeout(() => {
      //   this.schedulerRegistry.deleteTimeout('timeout1')
      // }, 5000);
      
  }
}
