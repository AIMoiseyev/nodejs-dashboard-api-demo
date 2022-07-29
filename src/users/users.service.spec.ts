import 'reflect-metadata';
import { Container } from 'inversify';
import { IConfigServiceInterface } from '../config/config.service.interface';
import { iUsersRepositoryInterface } from './users.repository.interface';
import { IUserService } from './users.service.interface';
import { TYPES } from '../types';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { Usermodel } from '@prisma/client';

const ConfigServiceMock: IConfigServiceInterface = {
	get: jest.fn(),
};

const UsersRepositoryMock: iUsersRepositoryInterface = {
	find: jest.fn(),
	create: jest.fn(),
};

const container = new Container();
let configService: IConfigServiceInterface;
let usersRepository: iUsersRepositoryInterface;
let usersService: IUserService;

beforeAll(() => {
	container.bind<IUserService>(TYPES.UsersService).to(UsersService);
	container.bind<IConfigServiceInterface>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
	container
		.bind<iUsersRepositoryInterface>(TYPES.UsersRepository)
		.toConstantValue(UsersRepositoryMock);

	configService = container.get<IConfigServiceInterface>(TYPES.ConfigService);
	usersRepository = container.get<iUsersRepositoryInterface>(TYPES.UsersRepository);
	usersService = container.get<IUserService>(TYPES.UsersService);
});

let createdUser: Usermodel | null;

describe('User Service', () => {
	it('createUser', async () => {
		configService.get = jest.fn().mockReturnValueOnce(1);
		usersRepository.create = jest.fn().mockImplementationOnce(
			(user: User): Usermodel => ({
				name: user.name,
				email: user.email,
				password: user.password,
				id: 1,
			}),
		);
		createdUser = await usersService.createUser({
			email: 'a@a.ru',
			name: 'Alex',
			password: '1',
		});
		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual('1');
	});

	it('validateUser - success', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const res = await usersService.validateUser({
			email: 'a@a.ru',
			password: '1',
		});

		expect(res).toBeTruthy();
	});

	it('validateUser - wrong password', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const res = await usersService.validateUser({
			email: 'a@a.ru',
			password: '2',
		});

		expect(res).toBeFalsy();
	});

	it('validateUser - wrong user', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(null);
		const res = await usersService.validateUser({
			email: 'a@a.ru',
			password: '2',
		});

		expect(res).toBeFalsy();
	});
});
