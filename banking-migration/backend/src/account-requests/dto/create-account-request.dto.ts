import { IsNotEmpty, IsString, Matches, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountRequestDto {
  @ApiProperty({ example: 'Mumbai' })
  @IsNotEmpty()
  @IsString()
  branch: string;

  @ApiProperty({ example: 'Savings' })
  @IsNotEmpty()
  @IsString()
  accountType: string;

  @ApiProperty({ example: 'Mr' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ example: '1990-01-15' })
  @IsNotEmpty()
  @IsDateString()
  dob: string;

  @ApiProperty({ example: '1234567890' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{10}$/, { message: 'WorkPhone must be exactly 10 digits' })
  workPhone: string;

  @ApiProperty({ example: '0987654321' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{10}$/, { message: 'HomePhone must be exactly 10 digits' })
  homePhone: string;

  @ApiProperty({ example: '123 Main Street' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ example: 'Maharashtra' })
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty({ example: '400001' })
  @IsNotEmpty()
  @IsString()
  zip: string;

  @ApiProperty({ example: 'john.doe@email.com' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[^@]+@[^@]+\.com$/, { message: 'Email must be a valid address ending in .com' })
  email: string;
}
