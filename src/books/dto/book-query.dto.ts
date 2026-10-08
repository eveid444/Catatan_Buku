import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from './pagination.dto';

export class BookQueryDto extends PaginationDto {
  @ApiPropertyOptional({
    example: 'novel,sekolah,fiksi',
    description: 'Filter berdasarkan tag, pisahkan dengan koma. Buku yang punya salah satu tag akan muncul.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  tag?: string;
}