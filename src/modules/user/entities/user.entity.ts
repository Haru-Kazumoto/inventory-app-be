import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Exclude, instanceToPlain } from "class-transformer";
import { BaseEntity } from "../../../entities/base.entity";
import { Roles } from "../../role/entities/roles.entity";

@Entity({name: "users"})
export class User extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    public id: number;

    @Column({name: "name", nullable: false})
    public name: string;

    @Column({name: "username", nullable: false, unique: true})
    public username: string;

    @Column({name: "password", nullable: false})
    @Exclude({toPlainOnly: true})
    public password: string;

    @Column({name: "role_id", nullable: false})
    public role_id: number;

    @ManyToOne(() => Roles, role => role.user)
    @JoinColumn()
    public role: Roles;

    toJSON(){
        return instanceToPlain(this)
    }

}
