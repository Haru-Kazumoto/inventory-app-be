import { Column, Entity, PrimaryColumn } from "typeorm";
import { LookupType } from "../enums/lookup-type.enum";
import { BaseEntity } from "src/utils/base.entity";

@Entity()
export class Lookup extends BaseEntity {

    @Column()
    public name: string;

    @Column()
    public type: LookupType

    @Column()
    public value: string;
}
