import { ExitLogs } from "src/modules/exit_logs/entities/exit_logs.entity";
import { BaseEntity } from "src/utils/base.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn,  } from "typeorm";

@Entity({name: "redeem_code"})
export class RedeemCode extends BaseEntity {

    @PrimaryGeneratedColumn("increment")
    public id: number;

    @Column({name: "redeem_code", unique: true, length: 5, nullable: true})
    public redeem_code: string;

    @Column({name: "generated_date", nullable: true})
    public generated_date: Date;

    @Column({name: "is_valid", nullable: true, default: true})
    public is_valid: boolean;

    @Column({name: "destroyed_date", nullable: true, default: null})
    public destroyed_date: Date;

    @Column({name: "log_id", nullable: false})
    public log_id: number;

    // --------------- RELATIONS --------------- //

    @OneToOne(() => ExitLogs, (exitLog) => exitLog.redeem_code)
    @JoinColumn()
    public exitLog: ExitLogs;

}