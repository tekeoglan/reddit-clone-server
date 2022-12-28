import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { users as UserModel, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

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

    let hashedPassword;
    if (data.password) {
      hashedPassword = await bcrypt.hash(data.password as string, 10);
    }

    return this.prisma.users.update({
      where,
      data: {
        password: hashedPassword || undefined,
        avatar_path: data.avatar_path || undefined,
      },
    });
  }

  async deleteUser(where: Prisma.usersWhereUniqueInput): Promise<UserModel> {
    return this.prisma.users.delete({ where });
  }
}
