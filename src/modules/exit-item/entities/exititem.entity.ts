import { ExitLog } from "src/modules/exit-log/entities/exitlog.entity";
import { BaseEntity } from "src/utils/base.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "exit-items"})
export class ExitItem extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    public id: number;

    @Column()
    public borrowers_name: string;
    @Column()
    public item_name: string;
    @Column({default: 0})
    public total_exit: number;
    @Column()
    public exit_date: Date;
    @Column()
    public class_id: number;
    @Column()
    public total_left: number;
    @Column()
    public item_id: number;

    //---------RELATIONS---------//

    public exit_logs: ExitLog;
    public 
}

