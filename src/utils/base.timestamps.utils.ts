import { Exclude, instanceToPlain } from "class-transformer";
import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from "typeorm";

export abstract class Timestamps {

    @CreateDateColumn({name: "created_at",})
    public created_at: Date;

    @UpdateDateColumn({name: "updated_at"})
    public updated_at: Date;

    @DeleteDateColumn({name: "deleted_at"})
    public deleted_at: Date | null;
}