import { JwtAuthGuard } from './../auth/guards/jwt.guard';
import { IdValidationPipe } from './../pipes/id-validation.pipe';
import { TopPageService } from './top-page.service';
import {FindTopPageDto} from './dto/find-top-page.dto';
import { Body, Delete, Get, HttpCode, NotFoundException, Param, Patch, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import {Controller, Post} from '@nestjs/common';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { TOP_PAGE_NOT_FOUND_ERROR } from './top-page.constants';

@Controller('top-page')
export class TopPageController {
	constructor(private readonly topPageService: TopPageService) {}

	@UsePipes(new ValidationPipe())
	@UseGuards(JwtAuthGuard)
	@Post('create')
	async create(@Body() dto: CreateTopPageDto) {
		return this.topPageService.create(dto);
	}

	@UseGuards(JwtAuthGuard)
	@Get(':id')
	async get(@Param('id', IdValidationPipe) id: string) {
		const topPage = await this.topPageService.findById(id);
		if (!topPage) {
			throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);
		}
		return topPage;
	}

	@Get('byAlias/:alias')
	async getByAlias(@Param('alias') alias: string) {
		const topPage = await this.topPageService.findByAlias(alias);
		if (!topPage) {
			throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);
		}
		return topPage;
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async delete(@Param('id', IdValidationPipe) id: string) {
		const deletedTopPage = await this.topPageService.deleteById(id);
		if (!deletedTopPage) {
			throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);
		}
		return deletedTopPage;
	}

	@UseGuards(JwtAuthGuard)
	@Patch(':id')
	async patch(@Param('id', IdValidationPipe) id: string, @Body() dto: CreateTopPageDto) {
		const updatedTopPage = await this.topPageService.updateById(id, dto);
		if (!updatedTopPage) {
			throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);
		}
		return updatedTopPage;
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('find')
	async find(@Body() dto: FindTopPageDto) {
		return this.topPageService.findByCattegory(dto.firstCategory);
	}

	@Get('textSearch/:text')
	async textSearch(@Param('text') text: string) {
		return this.topPageService.findByText(text);
	}
}
