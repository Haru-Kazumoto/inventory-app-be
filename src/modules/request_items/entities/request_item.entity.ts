import { BaseEntity } from 'src/entities/base.entity';
import { ItemType } from 'src/enums/item_type.enum';
import { Major } from 'src/enums/majors.enum';
import { RequestStatus } from 'src/enums/request_status.enum';
import { Class } from 'src/modules/class/entitites/class.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  //new
  @Column({ name: "item_type", nullable: true})
  public item_type: ItemType;

  @Column({name: "from_major", nullable: true})
  public from_major: string;

  @Column({ name: 'description', nullable: false })
  public description: string;

  @Column({ name: 'is_arrive', nullable: true })
  public is_arrive: boolean;

  @Column({ name: 'request_date', nullable: false })
  public request_date: Date; //waktu diminta pada

  @Column({ name: 'arrive_date', nullable: true })
  public arrive_date: Date; //waktu sampai pada

  @Column({ name: 'accepted_date', nullable: true })
  public accepted_date: Date; //waktu diterima pada

  @Column({name: 'on_the_way_date', nullable: true})
  public on_the_way_date: Date;

  @Column({ name: 'class_id', nullable: false })
  public class_id: number;

  @Column({name: "request_image", type: "text", nullable: true})
  public request_image: string;

  @ManyToOne(() => Class, (classEntity) => classEntity.request_item, {
    cascade: true,
    onDelete: 'CASCADE',
    eager: true,
    nullable: true,
  })
  @JoinColumn()
  public class: Class;

  @BeforeInsert()
  public setDate() {
    this.request_date = new Date();
  }

  @BeforeInsert()
  public setStatus() {
    this.status = RequestStatus.PENDING;
  }
}
