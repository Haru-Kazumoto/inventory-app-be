import { Major } from "src/enums/majors.enum";
import { Item } from "src/modules/items/entities/item.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Class {
    @PrimaryGeneratedColumn("increment")
    public id: number;

    @Column({name: "class_name", nullable: false})
    public class_name: string;

    @Column({name: "major", nullable: false, enum: Major, default: null})
    public major: Major;

    // @OneToOne(() => Item, (item) => item.class)
    @OneToMany(() => Item, (item) => item.class)
    public item: Item;
}