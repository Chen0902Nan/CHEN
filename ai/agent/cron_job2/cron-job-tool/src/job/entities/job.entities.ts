import {
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

export type JobType = 'cron' | 'every' | 'at';

@Entity()
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  instruction: string;

  @Column({ type: 'varchar', length: 10, default: 'cron' })
  type: JobType;

  // cron 类型使用
  @Column({ type: 'varchar', nullable: true })
  cron: string | null = null;

  // every 类型使用
  @Column({ type: 'int', nullable: true })
  everyMs: number | null;

  // at 类型使用
  @Column({ type: 'timestamp', nullable: true })
  at: Date | null;
  // 是否启用
  @Column({ default: true })
  isEnabled: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastRun: Date | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
