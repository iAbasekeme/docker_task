import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserBookmark } from './entities/user-bookmark.entity';

@Injectable()
export class UserBookmarkRepository extends Repository<UserBookmark> {
  constructor(private datasource: DataSource) {
    super(UserBookmark, datasource.createEntityManager());
  }
}
