import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Exclude, instanceToPlain } from "class-transformer";
import { Timestamps } from "../../utils/base.timestamps.utils";
import { Roles } from "../role/roles.entity";

@Entity({name: "users"})
export class User extends Timestamps{

    @PrimaryGeneratedColumn("increment")
    public id: number;

    @Column()
    public name: string;

    @Column()
    public username: string;

    @Column()
    @Exclude({toPlainOnly: true})
    public password: string;

    @Column()
    public role_id: number;

    @OneToOne(() => Roles, role => role.user)
    @JoinColumn()
    public role: Roles;

    toJSON(){
        return instanceToPlain(this)
    }
}
