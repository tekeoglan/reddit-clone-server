import { PickType } from '@nestjs/mapped-types';
import { UserCreateDTO } from './userCreate.dto';

export class UserPatchDTO extends PickType(UserCreateDTO, [
  'userAvatarPath' as const,
]) {}
