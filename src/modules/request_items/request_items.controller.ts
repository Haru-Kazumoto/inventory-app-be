import { RequestItemsService } from './request_items.service';
import { CreateRequestItemDto } from './dto/create-request_item.dto';
import { UpdateRequestItemDto } from './dto/update-request_item.dto';
import { PageOptionsDto } from 'src/utils/pagination.utils';
import * as NestCommon from '@nestjs/common';
import { RequestStatus } from 'src/enums/request_status.enum';
import { Roles } from 'src/security/decorator/roles.decorator';
import { FindAllRequestDecorator } from './decorator/find-all-request.decorator';
import { AuthenticatedGuard } from 'src/security/guards/authenticated.guard';
import { Status } from 'src/enums/response.enum';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { UpdateRequestDecorator } from './decorator/update-request.decorator';
import { DeleteRequestDecorator } from './decorator/delete-request.decorator';
import { CreateRequestDecorator } from './decorator/create-request.decorator';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import { RequestItem } from './entities/request_item.entity';
import { UpdateStatusAcceptDecorator } from './decorator/update-status-accept.decorator';
import { UpdateStatusRejectDecorator } from './decorator/update-status-reject.decorator';
import { UpdateStatusArriveDecorator } from './decorator/update-status-arrive.decorator';
import { UpdateStatusOnTheWayDecorator } from './decorator/update-status-on-the-way.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Request Items')
@NestCommon.Controller('request-items')
export class RequestItemsController {
  constructor(private readonly requestItemsService: RequestItemsService) {}

  // Menginzinkan role selain superadmin untuk membuat request
  @NestCommon.UseInterceptors(new TransformInterceptor())
  @NestCommon.UseGuards(AuthenticatedGuard)
  @Roles('ADMIN_TJKT', 'ADMIN_TO', 'ADMIN_TE', 'ADMIN_AK')
  @NestCommon.Post('create')
  @CreateRequestDecorator()
  public async createRequest(
    @NestCommon.Body() body: CreateRequestItemDto,
    @NestCommon.Response() response: ExpressResponse,
  ) {
    const data: RequestItem = await this.requestItemsService.createRequest(
      body,
    );

    return response.status(200).json({
      statusCode: response.statusCode,
      message: 'Request item berhasil dibuat',
      data: { request_item: data },
    });
  }

  // mengizinkan semua role untuk mengakses data request items
  @NestCommon.UseGuards(AuthenticatedGuard)
  @NestCommon.Get('find-all')
  @FindAllRequestDecorator()
  public findAll(
    @NestCommon.Query('class') className: string,
    @NestCommon.Query('status') status: RequestStatus,
    @NestCommon.Query() pageOptionsDto: PageOptionsDto,
  ) {
    return this.requestItemsService.findMany(className, status, pageOptionsDto);
  }

  // Mengizinkan role selain superadmin untuk mengupdate request
  @Roles('ADMIN_TJKT', 'ADMIN_TO', 'ADMIN_TE', 'ADMIN_AK')
  @NestCommon.Put('update')
  @NestCommon.UseInterceptors(new TransformInterceptor())
  @NestCommon.UseGuards(AuthenticatedGuard)
  @UpdateRequestDecorator()
  public async updateRequest(
    @NestCommon.Query('id', NestCommon.ParseIntPipe) id: number,
    @NestCommon.Body() dto: UpdateRequestItemDto,
    @NestCommon.Res() res: ExpressResponse,
  ) {
    const instance = await this.requestItemsService.updateRequest(id, dto);
    return res.status(200).json({
      statusCode: res.statusCode,
      message: Status.SUCCESS,
      data: { request_item: instance },
    });
  }

  // Mengizinkan role superadmin untuk mengupdate status request
  @Roles('SUPERADMIN')
  @NestCommon.Put('accept')
  @NestCommon.UseInterceptors(new TransformInterceptor())
  @NestCommon.UseGuards(AuthenticatedGuard)
  @UpdateStatusAcceptDecorator()
  public async acceptRequest(
    @NestCommon.Query('id', NestCommon.ParseIntPipe) id: number,
    @NestCommon.Res() res: ExpressResponse,
  ) {
    const instance = await this.requestItemsService.acceptRequest(id);
    return res.status(200).json({
      statusCode: res.statusCode,
      message: Status.SUCCESS,
      data: { request_item: instance },
    });
  }

  // Mengizinkan role superadmin untuk mengupdate status request
  @Roles('SUPERADMIN')
  @NestCommon.Put('reject')
  @NestCommon.UseInterceptors(new TransformInterceptor())
  @NestCommon.UseGuards(AuthenticatedGuard)
  @UpdateStatusRejectDecorator()
  public async rejectRequest(
    @NestCommon.Query('id', NestCommon.ParseIntPipe) id: number,
    @NestCommon.Res() res: ExpressResponse,
  ) {
    const instance = await this.requestItemsService.rejectRequest(id);
    return res.status(200).json({
      statusCode: res.statusCode,
      message: Status.SUCCESS,
      data: { request_item: instance },
    });
  }

  // Mengizinkan role superadmin untuk mengupdate status request
  @Roles('SUPERADMIN')
  @NestCommon.Put('arrive')
  @NestCommon.UseInterceptors(new TransformInterceptor())
  @NestCommon.UseGuards(AuthenticatedGuard)
  @UpdateStatusArriveDecorator()
  public async arriveRequest(
    @NestCommon.Query('id', NestCommon.ParseIntPipe) id: number,
    @NestCommon.Res() res: ExpressResponse,
  ) {
    const instance = await this.requestItemsService.arriveRequest(id);
    return res.status(200).json({
      statusCode: res.statusCode,
      message: Status.SUCCESS,
      data: { request_item: instance },
    });
  }

  // Mengizinkan role superadmin untuk mengupdate status request
  @Roles('SUPERADMIN')
  @NestCommon.Put('on-the-way')
  @NestCommon.UseInterceptors(new TransformInterceptor())
  @NestCommon.UseGuards(AuthenticatedGuard)
  @UpdateStatusOnTheWayDecorator()
  public async onTheWayRequest(
    @NestCommon.Query('id', NestCommon.ParseIntPipe) id: number,
    @NestCommon.Res() res: ExpressResponse,
  ) {
    const instance = await this.requestItemsService.onTheWayRequest(id);
    return res.status(200).json({
      statusCode: res.statusCode,
      message: Status.SUCCESS,
      data: { request_item: instance },
    });
  }

    // Mengizinkan role superadmin untuk mengupdate status request
  @NestCommon.Delete('delete')
  @NestCommon.UseGuards(AuthenticatedGuard)
  @DeleteRequestDecorator()
  public async deleteRequest(
    @NestCommon.Query('id', NestCommon.ParseIntPipe) id: number,
  ) {
    await this.requestItemsService.deleteRequest(id);
  }
}
