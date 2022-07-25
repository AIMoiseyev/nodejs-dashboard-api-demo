import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { Usermodel } from '@prisma/client';

export interface IUserService {
	createUser: (dto: UserRegisterDto) => Promise<Usermodel | null>;
	validateUser: (dto: UserLoginDto) => Promise<boolean>;
}
