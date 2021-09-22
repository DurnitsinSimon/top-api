import { getJwtConfig } from './../configs/jwt.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModel } from './user.model';
import { TypegooseModule } from 'nestjs-typegoose';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: UserModel,
				schemaOptions: {
					collection: 'User',
				},
			},
		]),
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJwtConfig
		}),
		PassportModule,
		 
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy],
	
})
export class AuthModule {}
