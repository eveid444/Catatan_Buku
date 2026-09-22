import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'eva123' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  password: string;
}