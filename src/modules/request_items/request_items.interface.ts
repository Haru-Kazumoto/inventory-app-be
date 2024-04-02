import { RequestStatus } from 'src/enums/request_status.enum';
import { CreateRequestItemDto } from './dto/create-request_item.dto';
import { RequestItem } from './entities/request_item.entity';
import { PageDto, PageOptionsDto } from 'src/utils/pagination.utils';
import { UpdateRequestItemDto } from './dto/update-request_item.dto';
import { ItemType } from 'src/enums/item_type.enum';
import { Major } from 'src/enums/majors.enum';

export interface IRequestItems {
  createRequest(body: CreateRequestItemDto): Promise<RequestItem>;
  findMany(
    className: string,
    // major: Major,
    status: RequestStatus,
    item_type: ItemType,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<RequestItem>>;
  updateRequest(id: number, body: UpdateRequestItemDto): Promise<RequestItem>;
  pendingRequest(
    major: Major,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<RequestItem>>;
  acceptRequest(id: number): Promise<RequestItem>;
  rejectRequest(id: number): Promise<RequestItem>;
  arriveRequest(id: number): Promise<RequestItem>;
  onTheWayRequest(id: number): Promise<RequestItem>;
  deleteRequest(id: number): Promise<void>;
}
