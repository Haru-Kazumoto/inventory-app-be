import { Column, Entity, PrimaryColumn } from "typeorm";
import { LookupType } from "../enums/lookup-type.enum";
import { BaseEntity } from "src/utils/base.entity";

@Entity({name: "lookup"})
export class Lookup extends BaseEntity {

    @Column()
    public name: string;

    @Column()
    public type: string;

    @Column()
    public value: string;
}
