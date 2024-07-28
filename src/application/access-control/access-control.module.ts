import { DynamicModule, Module } from '@nestjs/common';
import { AccessControlService } from './access-control.service';
import { RoleGuard } from './guards/role.guard';

@Module({
  providers: [AccessControlService, RoleGuard],
  exports: [AccessControlService, RoleGuard],
})
export class AccessControlModule {
  static forRoot(): DynamicModule {
    return {
      module: AccessControlModule,
      providers: [AccessControlService, RoleGuard],
      exports: [AccessControlService, RoleGuard],
      global: true,
    };
  }
}
