import { AuthDto } from './../src/auth/dto/auth.sto';
import {REVIEW_NOT_FOUND} from './../src/review/review.contstans';
import {CreateReviewDto} from './../src/review/dto/create-review.dto';
import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication, Body} from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from '../src/app.module';
import {Types, disconnect} from 'mongoose';

const productId = new Types.ObjectId().toHexString();

const loginDto: AuthDto = {
	email: 'test@email.com',
	password: '624ss182'
};

const testDto: CreateReviewDto = {
	name: 'Test',
	title: 'Title',
	description: 'Desc',
	rating: 5,
	productId,
};

describe('AppController (e2e)', () => {
	jest.setTimeout(10000);
	let app: INestApplication;
	let createdId: string;
	let token: string;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		const { body } = await request(app.getHttpServer()).post('/auth/login').send(loginDto);                     
		token = body.access_token;
	});

	it('/review/create (POST) - success', (done) => {
		request(app.getHttpServer())
			.post('/review/create')
			.send(testDto)
			.expect(201)
			.then(({body}: request.Response) => {
				createdId = body._id;
				 
				expect(createdId).toBeDefined();
				done();
			});
	});

	it('/auth/login (POST) - success', (done) => {
		request(app.getHttpServer())
			.post('/auth/login')
			.send(loginDto)
			.expect(201)
			.then(({body}: request.Response) => {
				console.log(body);
				expect(body.access_token).toBe(token);
				done();
			});
	});

	

	it('/review/byProduct/:productId (GET) - success', (done) => {
		request(app.getHttpServer())
			.get('/review/byProduct/' + productId)
			
			.expect(200)
			.then(({body}: request.Response) => {
				expect(body.length).toBe(1);
				done();
			});
	});

	it('/review/byProduct/:productId (GET) - failure', (done) => {
		request(app.getHttpServer())
			.get('/review/byProduct/' + new Types.ObjectId().toHexString())
			
			.expect(200)
			.then(({body}: request.Response) => {
				expect(body.length).toBe(0);
				done();
			});
	});

	it('/review/:id (DELETE) - success', () => {
		return request(app.getHttpServer())
			.delete('/review/' + createdId)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);
	});

	it('/review/:id (DELETE) - failure', () => {
		return request(app.getHttpServer())
			.delete('/review/' + new Types.ObjectId().toHexString())
			.set('Authorization', `Bearer ${token}`)
			.expect(404, {
				statusCode: 404,
				message: REVIEW_NOT_FOUND,
			});
	});

	afterAll(() => {
		disconnect();
	});
});
