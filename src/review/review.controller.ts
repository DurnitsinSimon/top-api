import { IdValidationPipe } from './../pipes/id-validation.pipe';
import { UserEmail } from './../decorators/user-email.decorator';
import { JwtAuthGuard } from './../auth/guards/jwt.guard';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import {
	Body,
	Delete,
	Param,
	Controller,
	Post,
	Get,
	HttpStatus,
	HttpException,
	UsePipes,
	ValidationPipe,
	UseGuards,
} from '@nestjs/common';
import { REVIEW_NOT_FOUND } from './review.contstans';
import { TelegramService } from 'src/telegram/telegram.service';

@Controller('review')
export class ReviewController {
	constructor(
		private readonly reviewService: ReviewService,
		private readonly telegramService: TelegramService
	) {}

	@UsePipes(new ValidationPipe())
	@Post('create')
	async create(@Body() dto: CreateReviewDto) {
		return this.reviewService.create(dto);
	}

	@UsePipes(new ValidationPipe())
	@Post('notify')
	async notify(@Body() dto: CreateReviewDto) {
		const message = `Имя ${dto.name}\n` 
		+ `Заголовок ${dto.title}\n`
		+ `Описание ${dto.description}\n`
		+ `Рейтинг ${dto.rating}\n`
		+ `ID продукта ${dto.productId}\n`;

		return this.telegramService.sendMessage(message);
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
	async getByProduct(
		@Param('productId', IdValidationPipe) productId: string
	) {
		return this.reviewService.findByProductId(productId);
	}
}
