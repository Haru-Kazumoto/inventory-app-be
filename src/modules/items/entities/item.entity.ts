import { Class } from "src/modules/class/entities/class.entity";
import { ExitItem } from "src/modules/exit-item/entities/exititem.entity";
import { ExitLog } from "src/modules/exit-log/entities/exitlog.entity";
import { BaseEntity } from "src/utils/base.entity";
import { BeforeInsert, Column, Entity, OneToMany } from "typeorm";

@Entity({name: "items"})
export class Item extends BaseEntity {
    @Column()
    public name: string;

    @Column()
    public item_code: string;

    @Column()
    public status_item: string; //lookup type STATUS

    @Column()
    public source_fund: string;

    @Column()
    public unit_price: number;

    @Column()
    public total_unit_price: number;

    @Column()
    public category_item: string; //lookup type CATEGOTRY harusnya kategory nya itu habis pakai dan tidak

    @Column()
    public class_id: number;

    @Column()
    public total_current_item: number;

    @Column()
    public item_type: string; //lookup type TYPE harusnya ATK dan NON ATK

    //--------RELATIONS-------------//

    @OneToMany(() => Class, classEntity => classEntity.item)
    public class: Class[];

    @OneToMany(() => Class, exitItem => exitItem.item)
    public exit_items: ExitItem[];

    //Will continue to update the numbers as the number of items increases
    @BeforeInsert()
    calculateTotalUnitPrice(){
        this.total_unit_price = this.unit_price * this.total_current_item;
    }
}
