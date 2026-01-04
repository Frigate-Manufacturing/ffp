import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { Tables } from '../../libs/constants';

@Injectable()
export class OrgService {
  private readonly logger = new Logger(OrgService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async getOrganizationConfig(orgId: string) {
    const client = this.supabaseService.getClient();

    const { data, error } = await client
      .from(Tables.OrganizationTable)
      .select('*')
      .eq('id', orgId)
      .single();

    if (error) {
      this.logger.error(`Error fetching organization config: ${error.message}`);
      return null;
    }

    return data;
  }
}
