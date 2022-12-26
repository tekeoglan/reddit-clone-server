import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import {
  users as UserModel,
  posts as PostModel,
  comments as CommentModel,
} from '@prisma/client';
import { useContainer } from 'class-validator';

describe('Users (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let user: UserModel;
  let post: PostModel;
  let comment: CommentModel;

  const userBaseShape = expect.objectContaining({
    user_id: expect.any(Number),
    user_name: expect.any(String),
    avatar_path: expect.any(String),
  });

  const userPostsShape = expect.objectContaining({
    posts: expect.any(Array),
  });

  const userCommentsShape = expect.objectContaining({
    comments: expect.any(Array),
  });

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);

    useContainer(app.select(AppModule), { fallback: true });

    await app.init();

    user = await prisma.users.create({
      data: { user_name: 'hasan', avatar_path: 'https:' },
    });

    post = await prisma.posts.create({
      data: {
        user_id: 1,
        title: 'test post',
        time_stamp: new Date().toISOString(),
      },
    });

    comment = await prisma.comments.create({
      data: {
        post_id: 1,
        user_id: 1,
        time_stamp: new Date().toISOString(),
        text: 'test comment',
      },
    });
  });

  afterAll(async () => {
    await prisma.truncate();
    await prisma.resetSequences();
    await prisma.$disconnect();
    await app.close();
  });

  describe('GET /users', () => {
    it('returns a list of users', async () => {
      const { status, body } = await request(app.getHttpServer()).get('/users');

      expect(status).toBe(200);
      expect(body).toStrictEqual(expect.arrayContaining([userBaseShape]));
    });
  });

  describe('POST /users/user', () => {
    it('create a user', async () => {
      const beforeCount = await prisma.users.count();

      const { status, body } = await request(app.getHttpServer())
        .post('/users/user')
        .send({
          userName: 'masum',
          userAvatarPath: 'https://',
        });

      const afterCount = await prisma.users.count();

      expect(status).toBe(201);
      expect(body).toStrictEqual(userBaseShape);
      expect(afterCount - beforeCount).toBe(1);
    });
  });

  describe('PATCH /users/user/:id', () => {
    it('patch a user', async () => {
      const { status, body } = await request(app.getHttpServer())
        .patch(`/users/user/${user.user_id}`)
        .send({ userAvatarPath: 'https://patched' });

      expect(status).toBe(200);
      expect(body).toStrictEqual(userBaseShape);
      expect(body.avatar_path).toEqual('https://patched');
    });
  });

  describe('GET /users/user/:id/overview', () => {
    it(`returns a user's overview`, async () => {
      const { status, body } = await request(app.getHttpServer()).get(
        `/users/user/${user.user_id}/overview`,
      );

      const overviewShape = expect.arrayContaining([
        expect.any(Object),
        expect.any(Object),
      ]);

      expect(status).toBe(200);
      expect(body).toStrictEqual(overviewShape);
    });
  });

  describe('GET /users/user/:id/posts', () => {
    it(`returns user's posts`, async () => {
      const { status, body } = await request(app.getHttpServer()).get(
        `/users/user/${user.user_id}/posts`,
      );
      expect(status).toBe(200);
      expect(body).toStrictEqual(userPostsShape);
    });
  });

  describe('GET /users/user/:id/comments', () => {
    it(`returns a user's comments`, async () => {
      const { status, body } = await request(app.getHttpServer()).get(
        `/users/user/${user.user_id}/comments`,
      );
      expect(status).toBe(200);
      expect(body).toStrictEqual(userCommentsShape);
    });
  });

  describe('DELETE /users/user/:id', () => {
    it(`deletes a user`, async () => {
      const beforeCount = await prisma.users.count();

      const { status, body } = await request(app.getHttpServer()).delete(
        `/users/user/${user.user_id}`,
      );

      const afterCount = await prisma.users.count();

      expect(status).toBe(200);
      expect(body).toStrictEqual(userBaseShape);
      expect(beforeCount - afterCount).toBe(1);
    });
  });
});
