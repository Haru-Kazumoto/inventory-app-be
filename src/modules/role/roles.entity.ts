import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { AccessPaths } from "../access_roles/roles.access.entity";
import { User } from "../user/user.entity";

@Entity({name: "roles"})
export class Roles {

    @PrimaryGeneratedColumn("increment")
    public id: number;

    @Column({unique: true})
    public name: string;

    @Column()
    public major: string;

    @OneToMany(
        () => AccessPaths, 
        accessPaths => accessPaths.role,
        {
            cascade: true,
            orphanedRowAction: "delete",
            eager: true
        }
    )
    public access_path: AccessPaths[];

    @OneToOne(() => User, (user) => user.role)
    public user: User;

}