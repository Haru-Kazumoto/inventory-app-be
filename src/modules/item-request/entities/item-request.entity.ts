import { BaseEntity } from "src/utils/base.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "item-requests"})
export class ItemRequest extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    public id: number;

    @Column()
    public name: string;

    @Column({default: 0})
    public total: number;

    @Column({type: "text"})
    public description: string;

    @Column()
    public class_id: number;

}
