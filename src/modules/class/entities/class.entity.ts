import { Item } from "src/modules/items/entities/item.entity";
import { BaseEntity } from "src/utils/base.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "class"})
export class Class extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    public id: number;

    @Column()
    public name: string;
    @Column()
    public major: string;

    @ManyToOne(() => Item, item => item.class)
    public item: Item;
}
