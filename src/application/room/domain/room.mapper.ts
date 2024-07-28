import { FindOptionsWhere, In } from 'typeorm';
import { FindRoomDto } from '../dto/find.dto';
import { UpdateRoomDto } from '../dto/update-room.dto';
import { Room } from '../entities/room.entity';

export class RoomMapper {
  static toDB(dto: FindRoomDto | UpdateRoomDto) {
    const dbQuery: FindOptionsWhere<Room> = {};
    if (dto?.hotelId) {
      dbQuery.hotelId = dto.hotelId;
    }
    if (dto.status) {
      dbQuery.status = In(dto.status.split(/\s*,\s*/));
    }
    if(dto.roomCategoryId){
      dbQuery.roomCategoryId = dto.roomCategoryId
    }
    return dbQuery;
  }
}
