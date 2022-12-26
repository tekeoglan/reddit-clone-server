import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

const users = [
  { user_id: 1, user_name: 'hasan', avatar_path: 'https://' },
  { user_id: 2, user_name: 'mehmet', avatar_path: 'https://' },
];

const user = users[0];

const db = {
  users: {
    findMany: jest.fn().mockResolvedValue(users),
    findFirst: jest.fn().mockResolvedValue(user),
    create: jest.fn().mockResolvedValue(user),
    update: jest.fn().mockResolvedValue(user),
    delete: jest.fn().mockResolvedValue(user),
  },
};

describe('-- Users Service --', () => {
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: db,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  describe('- getUsers -', () => {
    it('should return array of users', async () => {
      await expect(usersService.getUsers({})).resolves.toEqual(users);
    });
  });

  describe('- getUser -', () => {
    it('should return user', async () => {
      await expect(usersService.getUser({})).resolves.toEqual(user);
    });
  });

  describe('- createUser -', () => {
    it('should create user', async () => {
      await expect(
        usersService.createUser({ user_name: '', avatar_path: '' }),
      ).resolves.toEqual(user);
    });
  });

  describe('- updateUser -', () => {
    it('should update user', async () => {
      await expect(
        usersService.updateUser({
          where: { user_id: 1 },
          data: { avatar_path: '' },
        }),
      ).resolves.toEqual(user);
    });
  });

  describe('- deleteUser -', () => {
    it('should delete user', async () => {
      await expect(usersService.deleteUser({ user_id: 1 })).resolves.toEqual(
        user,
      );
    });
  });
});
