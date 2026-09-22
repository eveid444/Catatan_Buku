import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let service: AuthService;

  const mockUsersService = { findByUsername: jest.fn(), create: jest.fn() };
  const mockJwtService = { sign: jest.fn().mockReturnValue('mocked-jwt-token') };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should throw ConflictException when username already taken', async () => {
      mockUsersService.findByUsername.mockResolvedValue({ id: '1', username: 'eva123' });
      await expect(
        service.register({ username: 'eva123', password: 'password123' }),
      ).rejects.toThrow(ConflictException);
    });

    it('should hash the password and create a new user', async () => {
      mockUsersService.findByUsername.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue({ id: '1', username: 'eva123' });
      const result = await service.register({ username: 'eva123', password: 'password123' });
      expect(mockUsersService.create).toHaveBeenCalledWith('eva123', expect.any(String));
      expect(result).toEqual({ id: '1', username: 'eva123' });
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException when user does not exist', async () => {
      mockUsersService.findByUsername.mockResolvedValue(null);
      await expect(
        service.login({ username: 'unknown', password: 'password123' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is wrong', async () => {
      const hashed = await bcrypt.hash('correct-password', 10);
      mockUsersService.findByUsername.mockResolvedValue({ id: '1', username: 'eva123', password: hashed });
      await expect(
        service.login({ username: 'eva123', password: 'wrong-password' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return an access token when credentials are valid', async () => {
      const hashed = await bcrypt.hash('password123', 10);
      mockUsersService.findByUsername.mockResolvedValue({ id: '1', username: 'eva123', password: hashed });
      const result = await service.login({ username: 'eva123', password: 'password123' });
      expect(result).toEqual({ accessToken: 'mocked-jwt-token' });
    });
  });
});