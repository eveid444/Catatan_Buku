import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PaginationDto } from './dto/pagination.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorator/current-user.decorator';
import type { AuthenticatedUser } from '../common/decorator/current-user.decorator';

@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  create(@Body() dto: CreateBookDto, @CurrentUser() user: AuthenticatedUser) {
    return this.booksService.create(dto, user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  findAll(@Query() query: PaginationDto, @CurrentUser() user: AuthenticatedUser) {
    return this.booksService.findAll(query, user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(CacheInterceptor)      
  @CacheTTL(60)                            
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.booksService.findOne(id, user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBookDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.booksService.update(id, dto, user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.booksService.remove(id, user.userId);
  }
}