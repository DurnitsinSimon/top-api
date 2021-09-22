import {USER_NOT_FOUND_ERROR, PASSWORD_IS_NOT_VALID} from './auth.contstans';
import {UserModel} from './user.model';
import {AuthDto} from './dto/auth.sto';
import {Injectable, HttpException, HttpStatus, UnauthorizedException} from '@nestjs/common';
import {ModelType} from '@typegoose/typegoose/lib/types';
import {InjectModel} from 'nestjs-typegoose';
import {genSaltSync, hashSync, compare} from 'bcryptjs';
import {JwtService} from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
		private readonly jwtService: JwtService
	) {}

	async createUser(dto: AuthDto) {
		const salt = genSaltSync(10);

		const newUser = new this.userModel({
			email: dto.email,
			passwordHash: hashSync(dto.password, salt),
		});

		return newUser.save();
	}

	async findUser(email: string) {
		return this.userModel.findOne({email}).exec();
	}

	async validateUser(email: string, password: string): Promise<Pick<UserModel, 'email'>> {
		const user = await this.findUser(email);
		if (!user) {
			throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
		}

		const isCorrectPassword = await compare(password, user.passwordHash);
		if (!isCorrectPassword) {
			throw new UnauthorizedException(PASSWORD_IS_NOT_VALID);
		}

		return {email: user.email};
	}

	async login(email: string) {
		const payload = {email};
		return {
			access_token: await this.jwtService.signAsync(payload)
		};
	}
}
