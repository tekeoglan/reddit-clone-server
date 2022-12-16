import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { users as UserModel, Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUser(
    usersWhereUniqueInput: Prisma.usersWhereUniqueInput,
  ): Promise<UserModel | null> {
    return this.prisma.users.findUnique({
      where: usersWhereUniqueInput,
    });
  }

  async getUsers(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.usersWhereUniqueInput;
    where?: Prisma.usersWhereInput;
    orderBy?: Prisma.usersOrderByWithRelationInput;
  }): Promise<UserModel[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.users.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
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
