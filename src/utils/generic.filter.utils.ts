import { IsEnum, IsNumber, IsOptional } from "class-validator";

export class PaginateFilter {

    @IsNumber({},{message: "page attribute should be a number."})
    public page: number;
    
    @IsNumber({},{message: "pageSize attribute should be a number"})
    public pageSize: number;

    @IsOptional()
    public orderBy?: number;
}