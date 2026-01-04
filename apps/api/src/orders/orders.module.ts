import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { PermissionGuard } from 'src/permissions/permission.guard';
import { PermissionCheckService } from 'src/permissions/permisson-check.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ShippingAddressService } from './shipping-address.service';
import { OrderService } from './order.service';
import { RolesGuard } from 'src/auth/roles.guard';

@Module({
  imports: [SupabaseModule],
  controllers: [OrdersController],
  providers: [
    PermissionGuard,
    PermissionCheckService,
    AuthGuard,
    ShippingAddressService,
    OrderService,
    RolesGuard,
  ],
})
export class OrdersModule {}
