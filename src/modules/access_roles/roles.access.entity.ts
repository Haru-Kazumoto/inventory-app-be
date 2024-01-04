import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Roles } from "../role/roles.entity";

@Entity({name: "access_roles"})
export class AccessPaths {

    @PrimaryGeneratedColumn("increment")
    public id: number;

    @Column()
    public path: string;

    @ManyToOne(
        () => Roles, 
        role => role.access_path,
        {
            lazy: true
        }
    )
    public role: Roles;

}