import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { NotFoundException } from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from './entities/book.entity';

describe('BooksService', () => {
  let service: BooksService;

  const mockBookRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    findAndCount: jest.fn(),
    remove: jest.fn(),
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        { provide: getRepositoryToken(Book), useValue: mockBookRepository },
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should throw NotFoundException when book is not found', async () => {
      mockBookRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('non-existent-id', 'user-1')).rejects.toThrow(NotFoundException);
    });

    it('should return the book when found and owned by the user', async () => {
      const book = { id: 'book-1', userId: 'user-1', judul: 'Laskar Pelangi' };
      mockBookRepository.findOne.mockResolvedValue(book);
      const result = await service.findOne('book-1', 'user-1');
      expect(result).toEqual(book);
      expect(mockBookRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'book-1', userId: 'user-1' },
      });
    });
  });

  describe('create', () => {
    it('should attach userId and save the new book', async () => {
      const dto = { judul: 'Laskar Pelangi', penulis: 'Andrea Hirata' } as any;
      const created = { ...dto, userId: 'user-1' };
      mockBookRepository.create.mockReturnValue(created);
      mockBookRepository.save.mockResolvedValue({ id: 'book-1', ...created });
      const result = await service.create(dto, 'user-1');
      expect(mockBookRepository.create).toHaveBeenCalledWith({ ...dto, userId: 'user-1' });
      expect(result).toEqual({ id: 'book-1', ...created });
    });
  });
});