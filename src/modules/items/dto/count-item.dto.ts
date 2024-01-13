export class CountItemDto {
    readonly _class_name: string;
    readonly _count: number;

    constructor(class_name: string, count: number){
        this._class_name = class_name;
        this._count = count;
    }
}