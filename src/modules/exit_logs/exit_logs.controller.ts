import { Body, Controller, Get, HttpStatus, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ExitLogsService } from './exit_logs.service';
import { AuthenticatedGuard } from 'src/security/guards/authenticated.guard';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateExitLogDto } from './dtos/exit_logs.dto';
import { Response } from 'express';

@ApiTags('ExitLogs')
@UseGuards(AuthenticatedGuard)
@Controller('exit-logs')
export class ExitLogsController {
  constructor(private readonly exitLogsService: ExitLogsService) {}

  @ApiBody({type: CreateExitLogDto, description: "DTO Structure for exit logs"})
  @Post('create-log')
  async createLog(@Body() body: CreateExitLogDto, @Res() response: Response){
    const data = await this.exitLogsService.createLog(body);

    return response.status(201).json({
      statusCode: response.statusCode,
      message: HttpStatus.CREATED,
      data: {exit_log: data}
    });
  }

  @ApiQuery({
    name: "redeem-code",
    description: "For querying with redeem code",
    type: String,
    required: true
  })
  @Get("find-log-by-code")
  async findLogByRedeemCode(@Query("redeem-code") redeem_code: string, @Res() response: Response) {
    const data = await this.exitLogsService.findExitLogByRedeemCode(redeem_code);

    return response.status(200).json({
      statusCode: response.statusCode,
      message: HttpStatus.OK,
      data: {exit_log: data}
    });
  }
}
