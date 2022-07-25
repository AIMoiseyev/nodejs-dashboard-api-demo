import { iUsersRepositoryInterface } from './users.repository.interface';
import { User } from './user.entity';
import { Usermodel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '../types';
import { PrismaService } from '../database/prisma.service';

@injectable()
export class UsersRepository implements iUsersRepositoryInterface {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}
	async create({ email, password, name }: User): Promise<Usermodel> {
		return this.prismaService.client.usermodel.create({
			data: {
				email,
				password,
				name,
			},
		});
	}

	find(email: string): Promise<Usermodel | null> {
		return this.prismaService.client.usermodel.findFirst({
			where: {
				email,
			},
		});
	}
}
