import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    UpdateDateColumn,
    CreateDateColumn
} from 'typeorm';

export type JobType='cron'|'every'|'at'


//装饰器，将这个Job类映射成数据库中的表
@Entity()
export class Job{
    //uuid 代替自增，全局唯一，作为数据库主键
    @PrimaryGeneratedColumn('uuid')
    id!:string;

    @Column({type:'text'})
    instruction!:string;

    @Column({type:'varchar',length:10,default:'cron'})
    type!:JobType;

    @Column({type:'varchar',length:100,nullable:true})
    cron!:string|null

    @Column({type:'int',nullable:true})
    everyMs!:number|null;

    @Column({type:'timestamp',nullable:true})
    at!:Date|null;

    //是否启用
    @Column({default:true})
    isEnabled!:boolean;

    @Column({type:'timestamp',nullable:true})
    lastRun!:Date|null;

    @CreateDateColumn()
    createdAt!:Date;

    @UpdateDateColumn()
    updatedAt!:Date;
}