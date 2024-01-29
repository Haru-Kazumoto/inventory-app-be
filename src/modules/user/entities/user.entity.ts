import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Exclude, instanceToPlain } from "class-transformer";
import { BaseEntity } from "../../../utils/base.entity";
import { Roles } from "../../role/entities/roles.entity";
import { Notification } from "src/modules/notification/entities/notification.entity";
import { Request } from "express";

@Entity({name: "users"})
export class User extends BaseEntity{
    @PrimaryGeneratedColumn("increment")
    public id: number;

    @Column()
    public name: string;

    @Column({unique: true})
    public username: string;

    @Column()
    @Exclude({toPlainOnly: true})
    public password: string;

    @Column()
    public role_id: number;

    @ManyToOne(() => Roles, role => role.user)
    @JoinColumn()
    public role: Roles;

    @OneToMany(() => Notification, notification => notification.user, {eager: false})
    public notifications: Notification[];
    
    toJSON(){
        return instanceToPlain(this)
    }
}

export const getSession = (request: Request): Express.User => {
    return request.user;
}
