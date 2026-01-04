import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RoleNames } from '../../libs/constants';
import { CurrentUser } from '../auth/user.decorator';
import { CurrentUserDto } from '../auth/auth.dto';

@Controller('portal/dashboard')
@UseGuards(AuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @Roles(RoleNames.Customer)
  async getStats(@CurrentUser() user: CurrentUserDto) {
    return this.dashboardService.getStats(user.organizationId, user.id);
  }

  @Get('recent-quotes')
  @Roles(RoleNames.Customer)
  async getRecentQuotes(@CurrentUser() user: CurrentUserDto) {
    return this.dashboardService.getRecentQuotes(user.organizationId, user.id);
  }

  @Get('recent-orders')
  @Roles(RoleNames.Customer)
  async getRecentOrders(@CurrentUser() user: CurrentUserDto) {
    return this.dashboardService.getRecentOrders(user.organizationId);
  }
}
