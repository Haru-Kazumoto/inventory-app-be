import { BaseEntity } from "src/utils/base.entity";
import { Column, Entity } from "typeorm";

@Entity({name: "exit_log"})
export class ExitLog extends BaseEntity {

    @Column()
    public item_name: string;
    
    @Column()
    public borrowers_name?: string;
    
    @Column()
    public total_exit: string;
    
    @Column()
    public exit_date: Date;
    
    @Column()
    public entry_date?: Date;
    
    @Column()
    public class_name: string;
    
    @Column()
    public item_id: number;
    

}
