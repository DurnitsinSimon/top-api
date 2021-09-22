import { IdValidationPipe } from './../pipes/id-validation.pipe';
import { UserEmail } from './../decorators/user-email.decorator';
import { JwtAuthGuard } from './../auth/guards/jwt.guard';
import {ReviewService} from './review.service';
import {CreateReviewDto} from './dto/create-review.dto';
import {Body, Delete, Param, Controller, Post, Get, HttpStatus, HttpException, UsePipes, ValidationPipe, UseGuards} from '@nestjs/common';
import {REVIEW_NOT_FOUND} from './review.contstans';

@Controller('review')
export class ReviewController {
	constructor(private readonly reviewService: ReviewService) {}

	@UsePipes(new ValidationPipe())
	@Post('create')
	async create(@Body() dto: CreateReviewDto) {
		return this.reviewService.create(dto);
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async delete(@Param('id', IdValidationPipe) id: string) {
		const deletedDoc = await this.reviewService.delete(id);
		if (!deletedDoc) {
			throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
	}

	@Get('byProduct/:productId')
	async getByProduct(@Param('productId', IdValidationPipe) productId: string) {
		return this.reviewService.findByProductId(productId);
	}
}
