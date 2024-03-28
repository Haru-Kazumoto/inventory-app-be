import { applyDecorators } from "@nestjs/common";
import { ApiOkResponse, ApiQuery } from "@nestjs/swagger";
import { ItemCategory } from "src/enums/item_category.enum";

export function ApiFindManyLogs() {
    return applyDecorators(
        ApiOkResponse({
            description: 'Record has successfully created',
            schema: {
                type: 'object',
                properties: {
                    statusCode: { type: 'number', example: 200 },
                    timestamp: { type: 'string', format: 'date-time', example: "2024-01-20T00:00:00Z" },
                    payload: {
                        type: 'object',
                        properties: {
                            findManyLogsWithPagination: {
                                type: 'array',
                                example: [
                                    { /* Contoh objek log */ }
                                ]
                            },
                            meta: {
                                type: 'object',
                                properties: {
                                    page: { type: 'number', example: 1 },
                                    take: { type: 'number', example: 1 },
                                    itemCount: { type: 'number', example: 1 },
                                    pageCount: { type: 'number', example: 1 },
                                    hasPreviousPage: { type: 'boolean', example: false },
                                    hasNextPage: { type: 'boolean', example: true }
                                }
                            }
                        }
                    }
                }
            }
        }),
        ApiQuery({
            name: "category",
            description: "Find exit log by item category",
            enum: ItemCategory,
            required: true
        })
    )
}