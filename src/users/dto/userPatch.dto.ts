import { PartialType } from '@nestjs/mapped-types';
import { UserCreateDTO } from './userCreate.dto';

export class UserPatchDTO extends PartialType(UserCreateDTO) {
  userAvatarPath?: string;
}
