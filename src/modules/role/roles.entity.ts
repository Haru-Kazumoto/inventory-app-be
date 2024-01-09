import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/entity/user.entity";
import { BaseEntity } from "src/utils/base.entity";

@Entity({name: "roles"})
export class Roles extends BaseEntity {

    @Column({unique: true})
    public name: string;

    @Column()
    public major: string;

    @OneToOne(() => User, (user) => user.role)
    public user: User;

}