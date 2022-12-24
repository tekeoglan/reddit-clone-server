import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import User from './users.entity';
import { UserCreateDTO, UserPatchDTO } from './dto';

const testUser = {
  user_id: 1,
  user_name: 'hasan',
  avatar_path: 'https://',
};

const testUser2 = {
  user_id: 2,
  user_name: 'mehmet',
  avatar_path: 'https://',
};

describe('-- Users Controller --', () => {
  let usersController: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getUsers: jest.fn().mockResolvedValue([testUser, testUser2]),
            getUser: jest.fn().mockResolvedValue(testUser),
            createUser: jest
              .fn()
              .mockImplementation((args) =>
                Promise.resolve({ user_id: 1, ...args }),
              ),
            updateUser: jest.fn().mockImplementation((args) => {
              if (args.where.user_id !== testUser.user_id)
                return Promise.reject('user not exist');
              const patchedUser = testUser;
              patchedUser.avatar_path = args.data.avatar_path;
              return Promise.resolve({ ...patchedUser });
            }),
            deleteUser: jest.fn().mockImplementation((args) => {
              if (args.user_id !== testUser.user_id)
                return Promise.reject('user not found');
              return Promise.resolve({ ...testUser });
            }),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('- findAll -', () => {
    it('should return users', async () => {
      const result = [testUser, testUser2];
      await expect(usersController.findAll()).resolves.toEqual(result);
    });
  });

  describe('- create -', () => {
    it('should return created user', async () => {
      const data: UserCreateDTO = {
        userName: 'test',
        userAvatarPath: 'https://',
      };

      const result: typeof testUser = {
        user_id: 1,
        user_name: data.userName,
        avatar_path: data.userAvatarPath,
      };

      await expect(usersController.create(data)).resolves.toEqual(result);
    });
  });

  describe('- getUserOverView -', () => {
    it("should return User's overview property", async () => {
      await expect(usersController.getUserOverView('1')).resolves.toEqual(
        new User({}).overView,
      );
    });
  });

  describe('- getUsersPosts -', () => {
    it("should return User's posts", async () => {
      await expect(usersController.getUserPosts('1')).resolves.toEqual(
        new User({ ...testUser }),
      );
    });
  });

  describe('- getComments -', () => {
    it("should return User's comments", async () => {
      await expect(usersController.getUserComments('1')).resolves.toEqual(
        new User({ ...testUser }),
      );
    });
  });

  describe('- update -', () => {
    const data: UserPatchDTO = {
      userAvatarPath: 'https://',
    };

    const result: typeof testUser = {
      user_id: 1,
      user_name: testUser.user_name,
      avatar_path: data.userAvatarPath,
    };

    it("should update User's data", async () => {
      await expect(usersController.update('1', data)).resolves.toEqual(result);
    });

    it('should reject to update user', async () => {
      await expect(usersController.update('5', data)).rejects.toEqual(
        'user not exist',
      );
    });
  });

  describe('- delete -', () => {
    it('should delete User', async () => {
      await expect(usersController.remove('1')).resolves.toEqual(testUser);
    });

    it('should reject to delete user', async () => {
      await expect(usersController.remove('5')).rejects.toEqual(
        'user not found',
      );
    });
  });
});
