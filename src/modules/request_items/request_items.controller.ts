import { RequestItemsService } from './request_items.service';
import { CreateRequestItemDto } from './dto/create-request_item.dto';
import { UpdateRequestItemDto } from './dto/update-request_item.dto';
import { PageOptionsDto } from 'src/utils/pagination.utils';
import { RequestStatus } from 'src/enums/request_status.enum';
import { Roles } from 'src/security/decorator/roles.decorator';
import { FindAllRequestDecorator } from './decorator/find-all-request.decorator';
import { RequestItemsByStatusDecorator } from './decorator/request-items-by-status.decorator';
import { AuthenticatedGuard } from 'src/security/guards/authenticated.guard';
import { UpdateRequestDecorator } from './decorator/update-request.decorator';
import { DeleteRequestDecorator } from './decorator/delete-request.decorator';
import { CreateRequestDecorator } from './decorator/create-request.decorator';
import { RequestItem } from './entities/request_item.entity';
import { UpdateStatusAcceptDecorator } from './decorator/update-status-accept.decorator';
import { UpdateStatusRejectDecorator } from './decorator/update-status-reject.decorator';
import { UpdateStatusArriveDecorator } from './decorator/update-status-arrive.decorator';
import { UpdateStatusOnTheWayDecorator } from './decorator/update-status-on-the-way.decorator';
import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Post,
  Patch,
  Query,
  Res,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RolesGuard } from 'src/security/guards/roles.guard';
import { ItemType } from 'src/enums/item_type.enum';
import { Major } from 'src/enums/majors.enum';

@UseGuards(AuthenticatedGuard)
@ApiTags('Request Items')
@Controller('request-items')
export class RequestItemsController {
  constructor(private readonly requestItemsService: RequestItemsService) {}

  // Menginzinkan role selain superadmin untuk membuat request
  @UseGuards(RolesGuard)
  @Roles('ADMIN_TJKT', 'ADMIN_TO', 'ADMIN_TE', 'ADMIN_AK', 'SUPERADMIN')
  @CreateRequestDecorator()
  @Post('create')
  public async createRequest(@Body() body: CreateRequestItemDto) {
    const data: RequestItem = await this.requestItemsService.createRequest(
      body,
    );

    return {
      [this.createRequest.name]: data,
    };
  }

  // mengizinkan semua role untuk mengakses data request items
  @FindAllRequestDecorator()
  @Get('find-all')
  public findAll(
    @Query('major') majorName: Major,
    @Query('status') status: RequestStatus,
    @Query('item_type') item_type: ItemType,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    return this.requestItemsService.findMany(
      majorName,
      status,
      item_type,
      pageOptionsDto,
    );
  }

  @RequestItemsByStatusDecorator()
  @Get('pending-request')
  public pendingRequest(
    @Query('major') majorName: Major,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    return this.requestItemsService.pendingRequest(
      majorName,
      pageOptionsDto,
    );
  }
  // Mengizinkan role selain superadmin untuk mengupdate request
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(RolesGuard)
  @Roles('ADMIN_TJKT', 'ADMIN_TO', 'ADMIN_TE', 'ADMIN_AK')
  @UpdateRequestDecorator()
  @Patch('update')
  public async updateRequest(
    @Query('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRequestItemDto,
  ) {
    const instance = await this.requestItemsService.updateRequest(id, dto);

    return {
      [this.updateRequest.name]: instance,
    };
  }

  // Mengizinkan role superadmin untuk mengupdate status request
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(RolesGuard)
  @Roles('SUPERADMIN')
  @Patch('update-status/to-accept')
  @UpdateStatusAcceptDecorator()
  public async acceptRequest(@Query('id', ParseIntPipe) id: number) {
    const instance = await this.requestItemsService.acceptRequest(id);

    return {
      [this.acceptRequest.name]: instance,
    };
  }

  // Mengizinkan role superadmin untuk mengupdate status request
  @UseGuards(RolesGuard)
  @Roles('SUPERADMIN')
  @UpdateStatusRejectDecorator()
  @Patch('update-status/to-reject')
  public async rejectRequest(@Query('id', ParseIntPipe) id: number) {
    const instance = await this.requestItemsService.rejectRequest(id);

    return {
      [this.rejectRequest.name]: instance,
    };
  }

  // Mengizinkan role admin untuk mengupdate status request
  @UseGuards(RolesGuard)
  @Roles('ADMIN_TJKT', 'ADMIN_AK', 'ADMIN_TO', 'ADMIN_TE')
  @UpdateStatusArriveDecorator()
  @Patch('update-status/to-arrive')
  public async arriveRequest(@Query('id', ParseIntPipe) id: number) {
    const instance = await this.requestItemsService.arriveRequest(id);

    return {
      [this.arriveRequest.name]: instance,
    };
  }

  // Mengizinkan role superadmin untuk mengupdate status request
  @UseGuards(RolesGuard)
  @Roles('SUPERADMIN')
  @UpdateStatusOnTheWayDecorator()
  @Patch('update-status/to-on-the-way')
  public async onTheWayRequest(@Query('id', ParseIntPipe) id: number) {
    const instance = await this.requestItemsService.onTheWayRequest(id);

    return {
      [this.onTheWayRequest.name]: instance,
    };
  }

  @DeleteRequestDecorator()
  @Delete('delete')
  public async deleteRequest(@Query('id', ParseIntPipe) id: number) {
    await this.requestItemsService.deleteRequest(id);
  }
}
