import { DynamicModule, Module, ModuleMetadata } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';
import { AuditLogRepository } from './audit.repository';

const moduleDefinition: ModuleMetadata = {
  providers: [AuditService, AuditLogRepository],
  controllers: [AuditController],
  exports: [AuditService],
};

@Module(moduleDefinition)
export class AuditModule {
  static register(): DynamicModule {
    return {
      module: AuditModule,
      global: true,
      ...moduleDefinition,
    };
  }
}
