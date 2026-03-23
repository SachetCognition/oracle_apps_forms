import { Controller, Get, Post, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('manager')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('pending-requests')
  @ApiOperation({ summary: 'Get all pending account requests' })
  @ApiResponse({ status: 200, description: 'List of pending requests' })
  async getPendingRequests() {
    return this.adminService.getPendingRequests();
  }

  @Post('approve/:requestId')
  @ApiOperation({ summary: 'Approve an account request' })
  @ApiResponse({ status: 200, description: 'Request approved, account number returned' })
  @ApiResponse({ status: 404, description: 'Request not found' })
  async approve(@Param('requestId', ParseIntPipe) requestId: number) {
    return this.adminService.approve(requestId);
  }

  @Post('reject/:requestId')
  @ApiOperation({ summary: 'Reject an account request' })
  @ApiResponse({ status: 200, description: 'Request rejected' })
  @ApiResponse({ status: 404, description: 'Request not found' })
  async reject(@Param('requestId', ParseIntPipe) requestId: number) {
    return this.adminService.reject(requestId);
  }

  @Get('requests/:requestId')
  @ApiOperation({ summary: 'Get full account request details' })
  @ApiResponse({ status: 200, description: 'Request details' })
  @ApiResponse({ status: 404, description: 'Request not found' })
  async getRequest(@Param('requestId', ParseIntPipe) requestId: number) {
    return this.adminService.getRequestById(requestId);
  }
}
