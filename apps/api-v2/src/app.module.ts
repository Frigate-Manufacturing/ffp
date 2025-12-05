import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config'
import { SupabaseModule } from './supabase/supabase.module';
import { SupabaseService } from './supabase/supabase.service';
import { SupabaseController } from './supabase/supabase.controller';
import { AuthModule } from './auth/auth.module';
import { UserController } from './user/user.controller';
import { PermissionsModule } from './permissions/permissions.module';
import { validate } from './config/env.validation';
import { MaterialsController } from './materials/materials.controller';
import { MaterialsModule } from './materials/materials.module';
import { SupplierController } from './supplier/supplier.controller';
import { SupplierModule } from './supplier/supplier.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate,
      cache: true,
    }),
    SupabaseModule,
    AuthModule,
    PermissionsModule,
    MaterialsModule,
    SupplierModule,
  ],
  controllers: [AppController, SupabaseController, UserController, MaterialsController, SupplierController],
  providers: [AppService, SupabaseService],
})
export class AppModule { }
