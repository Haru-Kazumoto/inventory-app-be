import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Exclude, instanceToPlain } from "class-transformer";
import { BaseEntity } from "../../../utils/base.entity";
import { Roles } from "../../role/entities/roles.entity";
import { Notification } from "src/modules/notification/entities/notification.entity";

import * as bcrypt from "bcrypt";

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

    @OneToOne(() => Roles, role => role.user)
    @JoinColumn()
    public role: Roles;

    @OneToMany(() => Notification, notification => notification.user, {eager: false})
    public notifications: Notification[];

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword(){
        this.password = await bcrypt.hash(this.password, 15);
    }

    toJSON(){
        return instanceToPlain(this)
    }
}
