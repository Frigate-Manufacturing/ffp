import { Injectable, Logger } from '@nestjs/common';
import { CurrentUserDto } from 'src/auth/auth.dto';
import { SupabaseService } from 'src/supabase/supabase.service';
import { CreateShippingAddressDto } from './order.dto';
import { Tables } from '../../libs/constants';

@Injectable()
export class ShippingAddressService {
  private readonly logger = new Logger(ShippingAddressService.name);
  private readonly supabaseService: SupabaseService;

  constructor(supabaseService: SupabaseService) {
    this.supabaseService = supabaseService;
  }

  async createShippingAddress(
    currentUser: CurrentUserDto,
    body: CreateShippingAddressDto,
  ) {
    const client = this.supabaseService.getClient();

    const { data, error } = await client
      .from(Tables.ShippingAddressTable)
      .insert({
        organization_id: currentUser.organizationId,
        name: body.name,
        street1: body.street1,
        street2: body.street2,
        city: body.city,
        zip: body.zip,
        country: body.country,
        phone: body.phone,
        email: body.email,
        is_default: true,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      });

    return { data, error };
  }

  async getShippingAddress(currentUser: CurrentUserDto) {
    const client = this.supabaseService.getClient();

    const { data, error } = await client
      .from(Tables.ShippingAddressTable)
      .select('*')
      .eq('organization_id', currentUser.organizationId);

    return { data, error };
  }

  async updateShippingAddress(
    currentUser: CurrentUserDto,
    body: CreateShippingAddressDto,
  ) {
    const client = this.supabaseService.getClient();

    const { data, error } = await client
      .from(Tables.ShippingAddressTable)
      .update({
        name: body.street1,
        street1: body.street1,
        street2: body.street2,
        city: body.city,
        zip: body.zip,
        country: body.country,
        phone: body.phone,
        email: body.email,
        is_default: true,
        is_active: true,
        updated_at: new Date(),
      })
      .eq('organization_id', currentUser.organizationId);

    return { data, error };
  }

  async deleteShippingAddress(currentUser: CurrentUserDto, id: string) {
    const client = this.supabaseService.getClient();

    const { data, error } = await client
      .from(Tables.ShippingAddressTable)
      .delete()
      .eq('organization_id', currentUser.organizationId)
      .eq('id', id);

    return { data, error };
  }
}
