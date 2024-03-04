import { Body, Controller, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { ExitLogsService } from './exit_logs.service';
import { AuthenticatedGuard } from 'src/security/guards/authenticated.guard';
import { ApiBody, ApiTags } from '@nestjs/swagger';
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

}
