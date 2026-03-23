import { IsNotEmpty, IsString, IsNumber, Min, Max, Matches, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({ example: 'CR', enum: ['CR', 'DR'] })
  @IsNotEmpty()
  @IsString()
  @IsIn(['CR', 'DR'])
  transactionType: string;

  @ApiProperty({ example: 5000 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(9999999)
  amount: number;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{6}$/, { message: 'ChequeNo must be exactly 6 digits' })
  chequeNo: string;
}
