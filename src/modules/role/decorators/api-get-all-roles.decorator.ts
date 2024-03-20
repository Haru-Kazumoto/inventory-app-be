import { SetMetadata, applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { RoleCreateDto } from '../dto/role.dto';

export function ApiGetAllRoles() {
    return applyDecorators(
        ApiOkResponse({
            description: 'Record has successfully pulled',
            schema: {
                type: 'object',
                properties: {
                    statusCode: { type: 'number', example: 200 },
                    timestamp: {type: 'date', example: "2024-01-20"},
                    payload: {type: 'object', example: {
                        findAllRoles: [
                            {}
                        ]
                    }}
                },
            },
        }),
        ApiBadRequestResponse({
            description: 'Bad Request response',
            schema: {
                type: 'object',
                properties: {
                    statusCode: { type: 'number', example: 400 },
                    message: {type: 'string', example: "Bad request message..."},
                    error: {type: 'string', example: "Bad Request"}
                },
            },
        })
    )
}
