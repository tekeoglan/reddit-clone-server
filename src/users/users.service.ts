import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { users as UserModel, Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUsers(params: Prisma.usersFindManyArgs): Promise<unknown> {
    return this.prisma.users.findMany({
      ...params,
    });
  }

  async getUser(args: Prisma.usersFindFirstArgs): Promise<unknown> {
    return this.prisma.users.findFirst({
      ...args,
    });
  }

  async createUser(data: Prisma.usersCreateInput): Promise<UserModel> {
    return this.prisma.users.create({
      data,
    });
  }

  async updateUser(params: {
    where: Prisma.usersWhereUniqueInput;
    data: Prisma.usersUpdateInput;
  }): Promise<UserModel> {
    const { where, data } = params;
    return this.prisma.users.update({ data, where });
  }

  async deleteUser(where: Prisma.usersWhereUniqueInput): Promise<UserModel> {
    return this.prisma.users.delete({ where });
  }
}
