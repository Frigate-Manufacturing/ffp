import { Controller, Get, Put, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { PermissionGuard } from 'src/permissions/permission.guard';

@Controller('user')
@UseGuards(AuthGuard, PermissionGuard)
export class UserController {

}
