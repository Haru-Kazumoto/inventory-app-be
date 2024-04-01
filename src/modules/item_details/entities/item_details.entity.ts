import { ItemCategory } from "src/enums/item_category.enum";
import { ExitLogs } from "src/modules/exit_logs/entities/exit_logs.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ItemDetails {

    @PrimaryGeneratedColumn("increment")
    public id: number;

    @Column({name: "item_id", nullable: false})
    public item_id: number;

    //adding item name, item code from item id
    @Column({ name: "item_name", nullable: true})
    public item_name: string;

    @Column({name: "item_code", nullable: true})
    public item_code: string;
     
    @Column({name: "category_item", nullable: true, enum: ItemCategory, default: null})
    public category_item: ItemCategory;

    @Column({name: "total_exit_item", nullable: true, default: 0, type: "text"})
    public total_exit_item: any;

    @ManyToOne(() => ExitLogs, (exitLog) => exitLog.item_details)
    @JoinColumn({name: "exit_log_id"})
    public exit_log: ExitLogs;
}