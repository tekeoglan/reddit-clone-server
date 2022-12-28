import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { users as User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserCreateDTO } from '../users/dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

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
    const { password: hash, email, ...result } = user;
    const isOk = await bcrypt.compare(userPassword, hash);
    if (!isOk) return null;
    return result as User;
  }

  async login(user: User) {
    const payload = { username: user.user_name, sub: user.user_id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(data: UserCreateDTO) {
    const hashedPasword = await bcrypt.hash(data.userPassword, 10);
    const result = await this.usersService.createUser({
      user_name: data.userName,
      email: data.userEmail,
      password: hashedPasword,
    });
    return result;
  }
}
