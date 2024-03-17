import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { BaseEntity } from "../../../entities/base.entity";

@Entity({name: "roles"})
export class Roles extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    public id: number;

    @Column({unique: true})
    public name: string;

    @Column()
    public major: string;

    @OneToMany(() => User, (user) => user.role)
    public user: User[];

}