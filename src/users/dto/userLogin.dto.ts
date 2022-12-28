import { OmitType } from '@nestjs/mapped-types';
import { UserCreateDTO } from './userCreate.dto';

export class UserLoginDto extends OmitType(UserCreateDTO, [
  'userName',
] as const) {}
