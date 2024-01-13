import { User } from "src/modules/user/entity/user.entity";
import { BaseEntity } from "src/utils/base.entity";
import { BeforeInsert, BeforeRemove, BeforeUpdate, Column, Entity, ManyToOne } from "typeorm";

@Entity({name: "notifications"})
export class Notification extends BaseEntity {
    @Column()
    public title: string;

    @Column({type: "text"})
    public content: string;

    @Column()
    public date_send: Date;

    @Column()
    public color: string;

    @Column({default: false})
    public hasRead: boolean;
    
    @Column()
    public user_id: number;

    @ManyToOne(() => User, user => user.notifications)
    public user: User;

    @BeforeInsert()
    @BeforeUpdate()
    @BeforeRemove()
    sendDate(){
        this.date_send = new Date();    
    }
}
