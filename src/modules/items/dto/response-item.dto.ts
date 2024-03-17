import { Expose } from "class-transformer";
import { StatusItem } from "src/enums/status_item.enum";

export class GetAllItemResponse {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    item_code: string;

    @Expose()
    status_item: StatusItem;

    constructor(id: number, name: string, item_code: string, status_item: StatusItem) {
        this.id = id;
        this.name = name;
        this.item_code = item_code;
        this.status_item = status_item;
    }
}