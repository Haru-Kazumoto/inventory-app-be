import { ExitLogs } from "src/modules/exit_logs/entities/exit_logs.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ItemDetails {

    @PrimaryGeneratedColumn("increment")
    public id: number;

    @Column({name: "item_id", nullable: false})
    public item_id: number;

    // @Column({name: "exit_log_id", nullable: false})
    // public exit_log_id: number;

    @ManyToOne(() => ExitLogs, (exitLog) => exitLog.item_details)
    @JoinColumn({name: "exit_log_id"})
    public exit_log: ExitLogs;
}