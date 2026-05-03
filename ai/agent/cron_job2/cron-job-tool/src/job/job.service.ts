import { 
    Injectable,
    Inject,
    Logger,
    OnApplicationBootstrap//生命周期钩子，应用启动后执行
 } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';//用于管理（存储、查找、启停）内存中的所有任务
import { CronJob } from 'cron';//定义执行时间和触发时的回调函数
//实体管理器
import { EntityManager } from 'typeorm';//它是操作数据库（增删改查）的核心接口
import { Job } from './entities/job.entity';


@Injectable()
export class JobService implements OnApplicationBootstrap {
    
    private readonly logger=new Logger(JobService.name)
    @Inject(EntityManager)
    private readonly entityManager!:EntityManager
    
    @Inject(SchedulerRegistry)
    private readonly schedulerRegistry!:SchedulerRegistry

    async onApplicationBootstrap() {
        console.log('jobservice...');
        //// 逻辑：应用启动时，从数据库读取所有已启用的任务
        const enabledJob = await this.entityManager.find(Job,{where:{isEnabled:true}});
        console.log('enabledJob',enabledJob);
        
    }

    async addJob(
        input:
        |{type:'cron';instruction:string;cron:string;isEnabled?:boolean}
        |{type:'every';instruction:string;erveryMs:number;isEnabled?:boolean}
        |{type:'at';instruction:string;at:Date;isEnabled?:boolean}
    ){
        const entity=this.entityManager.create(Job,{
            instruction:input.instruction,
            type:input.type,
            cron:input.type==='cron'?input.cron:null,
            everyMs:input.type==='every'?input.erveryMs:null,
            at:input.type==='at'?input.at:null,
            isEnabled:input.isEnabled??true,
            lastRun:null
        });
        const saved=await this.entityManager.save(Job,entity);

        if(saved.isEnabled){
            await this.startRunTime(saved);
        }
        return saved;
    }

    private async startRunTime(job:Job){
        if(job.type==='cron'){
            //获取所有job
            const cronJobs=this.schedulerRegistry.getCronJobs();
            const existing = cronJobs.get(job.id);
            //如果存在
            if(existing){
                existing.start();
                return;
            }

            const runtimeJob=this.createCronJob(job);
            // this.schedulerRegistry.addCronJob(job.id,runtimeJob)

        }
    }
    private createCronJob(job:Job){
        //cron 表达式
        const cronExpr=job.cron??'';

        return new CronJob(cronExpr,async ()=>{
            this.logger.log(`run job ${job.id},${job.instruction}`);
            await this.entityManager.update(Job,job.id,{lastRun:new Date()})
        })
    }
}
