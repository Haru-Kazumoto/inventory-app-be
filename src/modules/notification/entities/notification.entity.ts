import { User } from "src/modules/user/entities/user.entity";
import { BaseEntity } from "src/utils/base.entity";
import { BeforeInsert, BeforeRemove, BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "notifications"})
export class Notification extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    public id: number;

    @Column()
    public title: string;

    @Column({type: "text"})
    public content: string;

    @Column()
    public date_send: Date;

    @Column({nullable: true})
    public color?: string | null; //For color status notification 

    @Column({default: false})
    public hasRead: boolean; //For status read notification on UI
    
    @Column()
    public user_id: number;

    @Column({default: false})
    public toSuperadmin: boolean;

    @BeforeInsert()
    @BeforeUpdate()
    @BeforeRemove()
    sendDate(){
        this.date_send = new Date();    
    }
}
