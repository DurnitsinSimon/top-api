import {ALREADY_REGISTERED_ERROR} from './auth.contstans';
import {AuthService} from './auth.service';
import {AuthDto} from './dto/auth.sto';
import {BadRequestException, Body, Controller, HttpCode, Post, UsePipes, ValidationPipe} from '@nestjs/common';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UsePipes(new ValidationPipe())
	@Post('register')
	async register(@Body() dto: AuthDto) {
		const oldUser = await this.authService.findUser(dto.email);
		if (oldUser) {
			throw new BadRequestException(ALREADY_REGISTERED_ERROR);
		}
		return this.authService.createUser(dto);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login')
	async login(@Body() {email, password}: AuthDto) {
		const user = await this.authService.validateUser(email, password);
        return this.authService.login(user.email);
	}
}
