import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PendingReview } from "./entities/pending-review.entity";

@Injectable()
export class PendingReviewRepository extends Repository<PendingReview> {
  constructor(private datasource: DataSource) {
    super(PendingReview, datasource.createEntityManager());
  }
}