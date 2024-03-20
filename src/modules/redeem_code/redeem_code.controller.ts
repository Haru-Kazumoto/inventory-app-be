import { Body, Controller, Get, HttpStatus, Patch, Post, Query, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { RedeemCodeService } from './redeem_code.service';
import { AuthenticatedGuard } from 'src/security/guards/authenticated.guard';
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateExitLogDto, UpdateExitLogDto } from '../exit_logs/dtos/exit_logs.dto';
import { Response } from 'express';
import { ApiPaginatedResponse } from 'src/decorator/paginate.decorator';
import { ExitLogs } from '../exit_logs/entities/exit_logs.entity';
import { PageOptionsDto } from 'src/utils/pagination.utils';
import { ApiGenerateRedeemCode } from './decorator/api-generate-redeem-code.decorator';
import { TransformResponseInterceptor } from 'src/interceptors/transform-response.interceptor';

@ApiTags('RedeemCode')
@UseGuards(AuthenticatedGuard)
@Controller('redeem-code')
export class RedeemCodeController {
  constructor(private readonly redeemCodeService: RedeemCodeService) {}

  @ApiGenerateRedeemCode()
  @Post('generate-code')
  async createRedeemCode(@Body() body: CreateExitLogDto) {
    const data = await this.redeemCodeService.createRedeemCode(body);

    return { 
      [this.createRedeemCode.name]: data
    }
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

  @ApiQuery({
    name: "status-code",
    description: "Filtering find codes with status code",
    required: false,
    type: String
  })
  @Get('find-all-codes')
  @ApiPaginatedResponse(ExitLogs)
  async findAllRedeemCodes(@Query('status-code') statusCode: "VALID" | "NOT VALID", @Query() pageOptionsDto: PageOptionsDto) {
    return await this.redeemCodeService.findAllRedeemCodes(statusCode, pageOptionsDto);
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

  @ApiQuery({
    name: "redeem-code",
    description: "Updating request item from redeem code",
    required: true,
    type: String
  })
  @ApiBody({type: UpdateExitLogDto, description: "DTO Update for updating request item"})
  @Patch('update-redeem-code')
  async updateRedeemCode(
    @Query('redeem-code') redeemCode: string,
    @Body() body: UpdateExitLogDto, 
    @Res() response: Response
  ){
    const data = await this.redeemCodeService.updateRedeemCode(redeemCode, body);

    return response.status(200).json({
      statusCode: response.statusCode,
      mesasge: "UPDATED",
      data: {redeem_code: data}
    });
  }
}
