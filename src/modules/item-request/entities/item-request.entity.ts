import { BaseEntity } from "src/utils/base.entity";
import { Column, Entity } from "typeorm";

@Entity({name: "item-requests"})
export class ItemRequest extends BaseEntity {

    @Column()
    public name: string;

    @Column({default: 0})
    public total: number;

    @Column({type: "text"})
    public description: string;

    @Column()
    public class_id: number;

}
