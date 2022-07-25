import { IUserService } from './users.service.interface';
import { User } from './user.entity';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';
import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { IConfigServiceInterface } from '../config/config.service.interface';
import { iUsersRepositoryInterface } from './users.repository.interface';
import { Usermodel } from '@prisma/client';

@injectable()
export class UsersService implements IUserService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigServiceInterface,
		@inject(TYPES.UsersRepository) private usersRepository: iUsersRepositoryInterface,
	) {}
	async createUser({ email, name, password }: UserRegisterDto): Promise<Usermodel | null> {
		const newUser = new User(email, name);
		const salt = this.configService.get('SALT');
		await newUser.setPassword(password, Number(salt));
		const existedUser = await this.usersRepository.find(email);
		if (existedUser) {
			return null;
		}
		return this.usersRepository.create(newUser);
	}

	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		const existedUser = await this.usersRepository.find(email);
		if (!existedUser) {
			return false;
		}
		const newUser = new User(existedUser.email, existedUser.name, existedUser.password);
		return newUser.comparePassword(password);
	}
}
