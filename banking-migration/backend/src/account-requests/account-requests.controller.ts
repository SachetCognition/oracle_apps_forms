import { Controller, Post, Get, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AccountRequestsService } from './account-requests.service';
import { CreateAccountRequestDto } from './dto/create-account-request.dto';

@ApiTags('Account Requests')
@Controller('account-requests')
export class AccountRequestsController {
  constructor(private readonly accountRequestsService: AccountRequestsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new account opening request' })
  @ApiResponse({ status: 201, description: 'Request created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async create(@Body() dto: CreateAccountRequestDto) {
    return this.accountRequestsService.create(dto);
  }

  @Get(':id/status')
  @ApiOperation({ summary: 'Check account request status' })
  @ApiResponse({ status: 200, description: 'Status returned' })
  @ApiResponse({ status: 404, description: 'Request not found' })
  async getStatus(@Param('id', ParseIntPipe) id: number) {
    return this.accountRequestsService.getStatus(id);
  }
}
