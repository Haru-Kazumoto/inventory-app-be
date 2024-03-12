import { RequestStatus } from 'src/enums/request_status.enum';
import { Class } from 'src/modules/class/entitites/class.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from 'src/utils/base.entity';

@Entity({ name: 'request_items' })
export class RequestItem extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column({ name: 'item_name', nullable: false })
  public item_name: string;

  @Column({ name: 'total_request', nullable: false })
  public total_request: number;

  @Column({ name: 'status', nullable: false })
  public status: RequestStatus;

  @Column({ name: 'description', nullable: false })
  public description: string;

  @Column({ name: 'is_arrive', nullable: true })
  public is_arrive: boolean;

  @Column({ name: 'request_date', nullable: false })
  public request_date: Date;

  @Column({ name: 'arrive_date', nullable: true })
  public arrive_date: Date;

  @Column({ name: 'accepted_date', nullable: true })
  public accepted_date: Date;

  @Column({ name: 'class_id', nullable: false })
  public class_id: number;

  @ManyToOne(() => Class, (classEntity) => classEntity.item, {
    cascade: true,
    onDelete: 'CASCADE',
    eager: true,
    nullable: true,
  })
  @JoinColumn()
  public class: Class;
}
