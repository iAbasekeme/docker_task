import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Invitations } from "./entities/invitation.entity";

@Injectable()
export class InvitationRepository extends Repository<Invitations> {
    constructor(private datasource: DataSource) {
        super(Invitations, datasource.createEntityManager())
    }
}
