import { Body, Controller, Get, HttpStatus, Patch, Post, Query, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { RedeemCodeService } from './redeem_code.service';
import { AuthenticatedGuard } from 'src/security/guards/authenticated.guard';
import { ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateExitLogDto, UpdateExitLogDto } from '../exit_logs/dtos/exit_logs.dto';
import { ApiPaginatedResponse } from 'src/decorator/paginate.decorator';
import { ExitLogs } from '../exit_logs/entities/exit_logs.entity';
import { PageOptionsDto } from 'src/utils/pagination.utils';
import { ApiGenerateRedeemCode } from './decorator/api-generate-redeem-code.decorator';
import { StatusCode } from 'src/enums/status_code.enum';
import { Major } from 'src/enums/majors.enum';
import { RolesGuard } from 'src/security/guards/roles.guard';
import { Roles } from 'src/security/decorator/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config';

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

  @UseInterceptors(FileInterceptor('exit_image', multerConfig))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateExitLogDto,
    description: 'DTO Structure Response',
  })
  @Post('generate-code-with-file')
  async createRedeemCodeWithFile(@Body() body: CreateExitLogDto, @UploadedFile() file: Express.Multer.File) {
    const data = await this.redeemCodeService.createRedeemCodeWithFile(body, file);
    return {
      [this.createRedeemCodeWithFile.name]: data
    }
  }

  @ApiQuery({
    name: "redeem-code",
    description: "parameter for searching by redeem-code",
    type: String,
    required: true
  })
  @Get('find-by-code')
  async findByRedeemCode(@Query("redeem-code") redeemCode: string) {
    const data = await this.redeemCodeService.findByRedeemCode(redeemCode);

    return {
      [this.findByRedeemCode.name]: data
    }
  }

  @ApiQuery({
    name: "major",
    description: "Find all redeem code by major",
    required: false,
    enum: Major
  })
  @ApiQuery({
    name: "status-code",
    description: "Filtering find codes with status code",
    required: false,
    enum: StatusCode
  })
  @Get('find-all-codes')
  @ApiPaginatedResponse(ExitLogs)
  async findAllRedeemCodes(
    @Query('major') major: Major,
    @Query('status-code') statusCode: StatusCode, 
    @Query() pageOptionsDto: PageOptionsDto
  ) {
    return await this.redeemCodeService.findAllRedeemCodes(major,statusCode, pageOptionsDto);
  }

  @ApiQuery({
    name: "redeem-code",
    description: "parameter for use redeem code",
    type: String,
    required: true
  })
  @Post('store-redeem-code')
  async storeRedeemCode(@Query("redeem-code") redeemCode: string){
    const data = await this.redeemCodeService.storeRedeemCode(redeemCode);

    return {
      [this.storeRedeemCode.name]: data
    }
  }

  @ApiQuery({
    name: "redeem-code",
    description: "parameter for find exit log by redeem code",
    type: String,
    required: true
  })
  @Get('find-exit-log')
  async findExitLogByRedeemCode(@Query("redeem-code") redeemCode: string){
    const data = await this.redeemCodeService.findExitLogByRedeemCode(redeemCode);

    return {
      [this.findExitLogByRedeemCode.name]: data
    }
  }

  @ApiQuery({
    name: "redeem-code",
    description: "Updating request item from redeem code",
    required: true,
    type: String
  })
  @ApiBody({type: UpdateExitLogDto, description: "DTO Update for updating request item"})
  @Patch('update-redeem-code')
  async updateRedeemCode(@Query('redeem-code') redeemCode: string,@Body() body: UpdateExitLogDto){
    const data = await this.redeemCodeService.updateRedeemCode(redeemCode, body);

    return {
      [this.updateRedeemCode.name]: data
    }
  }
}
