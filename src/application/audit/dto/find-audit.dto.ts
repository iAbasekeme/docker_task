import { IsOptional, IsString } from "class-validator";
import { BaseQueryDto } from "src/common/dto";
import { AuditPayload, OperationType } from "../audit.type";

export class FindAuditDto extends BaseQueryDto {
    @IsString()
    @IsOptional()
    operationType: OperationType

    @IsString()
    @IsOptional()
    subjectId: string

    @IsString()
    @IsOptional()
    subjectType: AuditPayload['subjectType']

    @IsString()
    @IsOptional()
    objectId: string

    @IsString()
    @IsOptional()
    objectType: string

    @IsString()
    @IsOptional()
    action: AuditPayload['action']

    @IsString()
    @IsOptional()
    targetApp: AuditPayload['targetApp']

    @IsString()
    @IsOptional()
    sourceApp: AuditPayload['sourceApp']

    @IsString()
    @IsOptional()
    level: AuditPayload['level']

    @IsString()
    @IsOptional()
    targetId: string
}