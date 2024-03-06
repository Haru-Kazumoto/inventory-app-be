import { ItemCategory } from "src/enums/item_category.enum";
import { ItemType } from "src/enums/item_type.enum";
import { StatusItem } from "src/enums/status_item.enum";
import { AuditLogs } from "src/modules/audit-logs/entities/audit_logs.entity";
import { Class } from "src/modules/class/entitites/class.entity";
import { BaseEntity } from "src/utils/base.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "items"})
export class Item extends BaseEntity {
    
    @PrimaryGeneratedColumn("increment")
    public id: number;

    @Column({name: "name", nullable: false})
    public name: string;

    @Column({name: "item_code", nullable: false, unique: true})
    public item_code: string;

    @Column({name: "status_item", nullable: false, enum: StatusItem, default: StatusItem.TERSEDIA})
    public status_item: StatusItem;

    @Column({name: "source_fund", nullable: true})
    public source_fund: string;

    @Column({name: "unit_price", nullable: false, default: 0})
    public unit_price: number;

    //handled by function
    @Column({name: "total_unit_price", nullable: true})
    public total_unit_price: number;

    @Column({name: "category_item", nullable: false, enum: ItemCategory, default: null})
    public category_item: ItemCategory; //lookup type CATEGOTRY harusnya kategory nya itu habis pakai dan tidak

    @Column({name: "class_id", nullable: false})
    public class_id: number;

    @Column({name: "total_current_item", nullable: false, default: 0})
    public total_current_item: number; //generated by query native

    @Column({name: "item_type", nullable: false, enum: ItemType, default: ItemType.NON_ATK})
    public item_type: ItemType; //lookup type TYPE harusnya ATK dan NON ATK

    //--------RELATIONS-------------//

    @OneToMany(() => AuditLogs, (audit) => audit.item)
    public audit_logs: AuditLogs[];

    @ManyToOne(() => Class, (classEntity) => classEntity.item)
    @JoinColumn()
    public class: Class;

    //Will continue to update the numbers as the number of items increases
    // @BeforeInsert()
    // @BeforeUpdate()
    // calculateTotalUnitPrice(){
    //     this.total_unit_price = this.unit_price * this.total_current_item;
    // }
}
