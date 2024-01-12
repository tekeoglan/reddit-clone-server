import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { users as User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserCreateDTO } from '../users/dto';
import { excludeKey } from '../utils';
import { UserLoginDto } from '../users/dto/userLogin.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(
    userEmail: string,
    userPassword: string,
  ): Promise<User | null> {
    const user = (await this.usersService.getUser({
      where: {
        email: userEmail,
      },
    })) as User;

    if (!user) return null;

    const isOk = await bcrypt.compare(userPassword, user.password);

    if (!isOk) return null;

    return user;
  }

  async login(data: UserLoginDto) {
    return this.validateUser(data.userEmail, data.userPassword);
  }

  async register(data: UserCreateDTO) {
    const hashedPasword = await bcrypt.hash(data.userPassword, 10);
    const result = await this.usersService.createUser({
      user_name: data.userName,
      email: data.userEmail,
      password: hashedPasword,
    });
    return excludeKey(result, ['password']);
  }
}
