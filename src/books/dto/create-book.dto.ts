import { IsString, IsInt, IsOptional, MinLength, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({ example: 'Laskar Pelangi' })
  @IsString()
  @MinLength(1)
  judul: string;

  @ApiProperty({ example: 'Andrea Hirata' })
  @IsString()
  @MinLength(1)
  penulis: string;

  @ApiPropertyOptional({ example: 'Bentang Pustaka' })
  @IsString()
  @IsOptional()
  penerbit?: string;

  @ApiPropertyOptional({ example: 2005 })
  @IsInt()
  @Min(1000)
  @IsOptional()
  tahunTerbit?: number;

  @ApiPropertyOptional({ example: 'Novel tentang anak-anak Belitung' })
  @IsString()
  @IsOptional()
  deskripsi?: string;
}