import { Body, Controller, Get, HttpStatus, Post, Query, Res, UseGuards } from '@nestjs/common';
import { RedeemCodeService } from './redeem_code.service';
import { AuthenticatedGuard } from 'src/security/guards/authenticated.guard';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateExitLogDto } from '../exit_logs/dtos/exit_logs.dto';
import { Response } from 'express';

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
}
