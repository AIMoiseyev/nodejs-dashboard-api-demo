import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
	@IsEmail({}, { message: 'Неверные имя пользователя или пароль' })
	email: string;

	@IsString({ message: 'Неверные имя пользователя или пароль' })
	password: string;
}
