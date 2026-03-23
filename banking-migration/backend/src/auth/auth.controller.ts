import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CustomerLoginDto } from './dto/customer-login.dto';
import { ManagerLoginDto } from './dto/manager-login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('customer-login')
  @ApiOperation({ summary: 'Customer login' })
  @ApiResponse({ status: 200, description: 'JWT token returned' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async customerLogin(@Body() dto: CustomerLoginDto) {
    return this.authService.customerLogin(dto.accountNumber, dto.password);
  }

  @Post('manager-login')
  @ApiOperation({ summary: 'Manager login' })
  @ApiResponse({ status: 200, description: 'JWT token returned' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async managerLogin(@Body() dto: ManagerLoginDto) {
    return this.authService.managerLogin(dto.username, dto.password);
  }

  @Post('register')
  @ApiOperation({ summary: 'Online registration for existing account' })
  @ApiResponse({ status: 201, description: 'Registration successful' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.accountNumber, dto.password);
  }
}
