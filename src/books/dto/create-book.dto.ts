import {
  IsString, IsInt, IsOptional, IsArray, ArrayMaxSize, MinLength, MaxLength, Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
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

  @ApiPropertyOptional({ example: ['novel', 'sekolah'], type: [String] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(30, { each: true })
  @Transform(({ value }: { value: unknown }) =>
    Array.isArray(value)
      ? [...new Set(value.map((tag) => String(tag).trim().toLowerCase()))]
      : value,
  )
  tags?: string[];
}