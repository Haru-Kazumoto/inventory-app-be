import { Body, Controller, Get, HttpStatus, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ExitLogsService } from './exit_logs.service';
import { AuthenticatedGuard } from 'src/security/guards/authenticated.guard';
import { ApiBody, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/decorator/paginate.decorator';
import { ExitLogs } from './entities/exit_logs.entity';
import { PageOptionsDto } from 'src/utils/pagination.utils';
import { ItemCategory } from 'src/enums/item_category.enum';
import { ApiFindManyLogs } from './decorator/api-find-many-logs.decorator';
import { Major } from 'src/enums/majors.enum';
import { Response } from 'express';
import { ExitLogsRepository } from './repositories/exit_logs.repository';

@ApiTags('ExitLogs')
@UseGuards(AuthenticatedGuard)
@Controller('exit-logs')
export class ExitLogsController {
  constructor(
    private readonly exitLogsService: ExitLogsService,
    private readonly exitLogsRepository: ExitLogsRepository,
  ) {}

  @ApiPaginatedResponse(ExitLogs)
  @ApiFindManyLogs()
  @Get('find-all')
  async findManyLogsWithPagination(
    @Query('category') filterCategory: ItemCategory,
    @Query('major') major: Major,
    @Query() pageOptionsDto: PageOptionsDto
  ) {
    return await this.exitLogsService.findAllLogs(
      filterCategory,major,pageOptionsDto
    );
  }

  @ApiQuery({
    name: "borrower-name",
    description: "query for find log by borrower name",
    type: String,
    required: true
  })
  @Get('find-log-by-name')
  public async findLogByBorrowerName(@Query("borrower-name") borrowerName: string) {
    const data = await this.exitLogsService.findLogByBorrowerName(borrowerName);

    return {
      [this.findLogByBorrowerName.name]: data
    }
  }

  @ApiQuery({
    name: "log-id",
    description: "log id",
    type: Number,
    required: true
  })
  @Get("find-log-by-id")
  async findLogById(@Query('log-id') logId: number) {
    const data = await this.exitLogsService.findLogById(logId);

    return {
      [this.findLogById.name]: data
    }
  }

  // ------------------ EXPORT FUNCTIOn
  @ApiQuery({
    name: "item-category",
    description: "export all exit log by item category",
    required: true,
    enum: ItemCategory
  })
  @ApiQuery({
    name: 'major',
    description: 'Mengambil data berdasarkan tempat barang berada',
    enum: Major,
    required: true,
  })
  @Get('export-data-log')
  async exportExitLogByItemCategory(
    @Query('item-category') item_category: ItemCategory,
    @Query('major') major: Major,
    @Res() response: Response
  ): Promise<void>{
    const data: ExitLogs[] = await this.exitLogsRepository.find({
      where: {
        item_category: item_category,
        for_major: major
      },
      // relations: 
    })
  }

}
