import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PaginationDto } from './dto/pagination.dto';
import { IResponsePageWrapper } from '../common/interfaces/response.interface';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async create(dto: CreateBookDto, userId: string): Promise<Book> {
    const book = this.bookRepository.create({ ...dto, userId });
    return this.bookRepository.save(book);
  }

  async findAll(query: PaginationDto, userId: string): Promise<IResponsePageWrapper<Book>> {
    const { page, limit } = query;

    const [data, totalData] = await this.bookRepository.findAndCount({
      where: { userId },
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
    const book = await this.bookRepository.findOne({ where: { id, userId } });
    if (!book) {
      throw new NotFoundException(`Buku dengan id ${id} tidak ditemukan`);
    }
    return book;
  }

  async update(id: string, dto: UpdateBookDto, userId: string): Promise<Book> {
    const book = await this.findOne(id, userId);
    Object.assign(book, dto);
    const updated = await this.bookRepository.save(book);
    await this.cacheManager.del(`/books/${id}`);
    return updated;
  }

  async remove(id: string, userId: string): Promise<void> {
    const book = await this.findOne(id, userId);
    await this.bookRepository.remove(book);
    await this.cacheManager.del(`/books/${id}`);
  }
}