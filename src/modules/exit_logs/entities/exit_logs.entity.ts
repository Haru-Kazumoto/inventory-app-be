import { ItemCategory } from "src/enums/item_category.enum";
import { StatusExit } from "src/enums/status_exit.enum";
import { ItemDetails } from "src/modules/item_details/entities/item_details.entity";
import { RedeemCode } from "src/modules/redeem_code/entities/redeem_code.entity";
import { BaseEntity } from "src/entities/base.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Major } from "src/enums/majors.enum";

@Entity()
export class ExitLogs extends BaseEntity {

    @PrimaryGeneratedColumn("increment")
    public id: number;

    @Column({name: "name", nullable: false})
    public name: string;

    @Column({name: "phone", nullable: false})
    public phone: string;

    @Column({name: "major_class", nullable: false})
    public major_class: string;

    @Column({name: "item_category", enum: ItemCategory, default: ItemCategory.BARANG_HABIS_PAKAI, nullable: false})
    public item_category: ItemCategory;

    @Column({name: "exit_class", default: null, nullable: true})
    public exit_class: string;

    @Column({name: "status_exit", enum: StatusExit, default: null, nullable: false})
    public status_exit: StatusExit;

    @Column({name: "for_major", nullable: true})
    public for_major: string;

    @Column({name: "exit_image", nullable: true, type: 'text'})
    public exit_image: string;

    // --------------- RELATIONS --------------- //

    @OneToOne(() => RedeemCode, (redeemCode) => redeemCode.redeem_code)
    @JoinColumn()
    public redeem_code: RedeemCode;

    @OneToMany(
        () => ItemDetails, 
        (itemDetails) => itemDetails.exit_log,
        {
            cascade: true,
            eager: true, 
            onDelete: "CASCADE",
            nullable: true
        }
    )
    public item_details: ItemDetails[];

}