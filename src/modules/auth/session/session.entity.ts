import { ISession } from "connect-typeorm";
import { Request } from "express";
import { Column, DeleteDateColumn, Entity, Index, PrimaryColumn } from "typeorm";

@Entity({name: 'sessions'})
export class Session implements ISession{
    @Index()
    @Column("bigint")
    public expiredAt = Date.now();

    @PrimaryColumn("varchar", { length: 255 })
    public id = "";

    @Column("text")
    public json = "";

    @DeleteDateColumn()
    public destroyedAt?: Date;
}

export const getSession = (request: Request): Express.User => {
    return request.user;
}