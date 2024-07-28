import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { HotelRating } from "./entities/hotel-rating.entity";

@Injectable()
export class HotelRatingRepository extends Repository<HotelRating> {
  constructor(private datasource: DataSource) {
    super(HotelRating, datasource.createEntityManager());
  }
}