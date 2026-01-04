import {
  Controller,
  Get,
  Logger,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CurrentUserDto } from 'src/auth/auth.dto';
import { CurrentUser } from 'src/auth/user.decorator';
import { OrgService } from './org.service';

@Controller('org')
@UseGuards(AuthGuard)
export class OrgController {
  private readonly logger = new Logger(OrgController.name);

  constructor(private readonly orgService: OrgService) {}

  @Get('current')
  async getCurrentOrg(@CurrentUser() user: CurrentUserDto) {
    if (!user.organizationId) {
      throw new NotFoundException('User does not belong to an organization');
    }

    const org = await this.orgService.getOrganizationConfig(
      user.organizationId,
    );

    if (!org) {
      throw new NotFoundException('Organization not found');
    }

    return org;
  }
}
