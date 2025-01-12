import { User } from "src/modules/user/entities/user.entity";
import { BaseEntity } from "../../../entities/base.entity";
import { BeforeInsert, BeforeRemove, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "notifications"})
export class Notification extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    public id: number;

    @Column({nullable: true})
    public title?: string;

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

    @Column({type: "text", nullable: true})
    public superadmin_content?: string;

    // @OneToOne(() => User, (user) => user.notification)
    // @JoinColumn()
    // public user: User;

    @BeforeInsert()
    @BeforeUpdate()
    @BeforeRemove()
    sendDate(){
        this.date_send = new Date();    
    }
}
