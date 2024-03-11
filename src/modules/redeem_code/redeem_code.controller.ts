import { Body, Controller, Get, HttpStatus, Post, Query, Res, UseGuards } from '@nestjs/common';
import { RedeemCodeService } from './redeem_code.service';
import { AuthenticatedGuard } from 'src/security/guards/authenticated.guard';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateExitLogDto } from '../exit_logs/dtos/exit_logs.dto';
import { Response } from 'express';
import { ApiPaginatedResponse } from 'src/decorator/paginate.decorator';
import { ExitLogs } from '../exit_logs/entities/exit_logs.entity';
import { PageOptionsDto } from 'src/utils/pagination.utils';

@ApiTags('RedeemCode')
@UseGuards(AuthenticatedGuard)
@Controller('redeem-code')
export class RedeemCodeController {
  constructor(private readonly redeemCodeService: RedeemCodeService) {}

  @ApiBody({type: CreateExitLogDto, description: "DTO Structure for exit logs"})
  @Post('generate-code')
  async createRedeemCode(@Body() body: CreateExitLogDto, @Res() response: Response) {
    const data = await this.redeemCodeService.createRedeemCode(body);

    return response.status(201).json({
      statusCode: response.statusCode,
      message: HttpStatus.CREATED,
      data: {redeem_code: data}
    });
  }

  @ApiQuery({
    name: "redeem-code",
    description: "parameter for searching by redeem-code",
    type: String,
    required: true
  })
  @Get('find-by-code')
  async findByRedeemCode(@Query("redeem-code") redeemCode: string, @Res() response: Response) {
    const data = await this.redeemCodeService.findByRedeemCode(redeemCode);

    return response.status(200).json({
      statusCode: response.statusCode,
      message: "OK",
      data: {redeem_code: data}
    });
  }

  @Get('find-all-codes')
  @ApiPaginatedResponse(ExitLogs)
  async findAllRedeemCodes(@Query() pageOptionsDto: PageOptionsDto) {
    return await this.redeemCodeService.findAllRedeemCodes(pageOptionsDto);
  }

  @ApiQuery({
    name: "redeem-code",
    description: "parameter for use redeem code",
    type: String,
    required: true
  })
  @Post('store-redeem-code')
  async storeRedeemCode(@Query("redeem-code") redeemCode: string, @Res() response: Response){
    const data = await this.redeemCodeService.storeRedeemCode(redeemCode);

    return response.status(200).json({
      statusCode: response.statusCode,
      message: "OK",
      data: {redeem_code: data}
    });
  }

  @ApiQuery({
    name: "redeem-code",
    description: "parameter for find exit log by redeem code",
    type: String,
    required: true
  })
  @Get('find-exit-log')
  async findExitLogByRedeemCode(@Query("redeem-code") redeemCode: string, @Res() response: Response){
    const data = await this.redeemCodeService.findExitLogByRedeemCode(redeemCode);

    return response.status(200).json({
      statusCode: response.statusCode,
      message: "OK",
      data: {exit_log: data}
    });
  }
}
