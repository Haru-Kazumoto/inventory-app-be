import { applyDecorators } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBody, ApiOkResponse } from "@nestjs/swagger";
import { CreateExitLogDto } from "src/modules/exit_logs/dtos/exit_logs.dto";

export function ApiGenerateRedeemCode() {
    return applyDecorators(
        ApiOkResponse({
            description: "Record has successfully created",
            schema: {
              type: "object",
              properties: {
                statusCode: {type: "number", example: 200},
                timestamp: {type: "date", example: new Date()},
                payload: {type: "object", example: {
                  generateRedeemCode: {}
                }}
              }
            }
          }),
          ApiBadRequestResponse({
            description: "Bad Request Response",
            schema: {
              type: 'object',
              properties: {
                statusCode: {type: 'number', example: 200},
                message: {type: 'string', example: "Bad request Message"},
                error: {type: "string", example: "Bad Request"}
              }
            }
          }),
          ApiBody({type: CreateExitLogDto, description: "DTO Structure for exit logs"})
    )
}