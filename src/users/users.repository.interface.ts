import { User } from './user.entity';
import { Usermodel } from '@prisma/client';

export interface iUsersRepositoryInterface {
	create: (user: User) => Promise<Usermodel>;
	find: (email: string) => Promise<Usermodel | null>;
}
