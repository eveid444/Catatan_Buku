import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PaginationDto } from './dto/pagination.dto';
import { IResponsePageWrapper } from '../common/interfaces/response.interface';
import { ArrayOverlap, Repository } from 'typeorm';
import { BookQueryDto } from './dto/book-query.dto';

const BOOK_CACHE_TTL_MS = 60_000;

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  private bookCacheKey(userId: string, id: string): string {
    return `book:${userId}:${id}`;
  }

  private async findOwnedOrFail(id: string, userId: string): Promise<Book> {
    const book = await this.bookRepository.findOne({ where: { id, userId } });
    if (!book)
      throw new NotFoundException(`Buku dengan id ${id} tidak ditemukan`);
    return book;
  }

  async create(dto: CreateBookDto, userId: string): Promise<Book> {
    const book = this.bookRepository.create({ ...dto, userId });
    return this.bookRepository.save(book);
  }

  async findAll(
    query: BookQueryDto,
    userId: string,
  ): Promise<IResponsePageWrapper<Book>> {
    const { page, limit, tag } = query;

    const tags = (tag ?? '')
      .split(',')
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean);

    const [data, totalData] = await this.bookRepository.findAndCount({
      where:
        tags.length > 0 ? { userId, tags: ArrayOverlap(tags) } : { userId },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    const totalPages = Math.ceil(totalData / limit);

    return {
      data,
      meta: { totalPages, totalData, totalDataPerPage: limit, page, limit },
    };
  }

  async findOne(id: string, userId: string): Promise<Book> {
    const key = this.bookCacheKey(userId, id);
    const cached = await this.cacheManager.get<Book>(key);
    if (cached) return cached;

    const book = await this.findOwnedOrFail(id, userId);
    await this.cacheManager.set(key, book, BOOK_CACHE_TTL_MS);
    return book;
  }

  async update(id: string, dto: UpdateBookDto, userId: string): Promise<Book> {
    const book = await this.findOwnedOrFail(id, userId);
    Object.assign(book, dto);
    const updated = await this.bookRepository.save(book);
    await this.cacheManager.del(this.bookCacheKey(userId, id));
    return updated;
  }

  async remove(id: string, userId: string): Promise<void> {
    const book = await this.findOwnedOrFail(id, userId);
    await this.bookRepository.remove(book);
    await this.cacheManager.del(this.bookCacheKey(userId, id));
  }
}
