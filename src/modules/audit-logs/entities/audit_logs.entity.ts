import { EditMethod } from "src/enums/edit_methods.enum";
import { Item } from "src/modules/items/entities/item.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AuditLogs {
    @PrimaryGeneratedColumn("increment")
    public id: number;

    @Column({name: "edited_by", nullable: false})
    public edited_by: number;

    @Column({name: "edited_at", nullable: false})
    public edited_at: Date;

    @Column({name: "edit_method", nullable: false, enum: EditMethod, default: null})
    public edit_method: EditMethod;
    
    @Column({name: "item_id", nullable: false})
    public item_id: number;

    @ManyToOne(() => Item, (item) => item.audit_logs)
    @JoinColumn()
    public item: Item;

    @BeforeInsert()
    @BeforeUpdate()
    public setDate(){
        this.edited_at = new Date();
    }
}