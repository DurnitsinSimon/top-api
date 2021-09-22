import { Type } from 'class-transformer';
import { IsString, IsNumber, IsOptional, IsArray, ValidateNested } from 'class-validator';

class ProductCharasteristicDto {
	@IsString()
	name: string;

	@IsString()
	value: string;
}

export class CreateProductDto {
	@IsString()
	image: string;

	@IsString()
	title: string;

	@IsNumber()
	price: number;

	@IsOptional()
	@IsNumber()
	oldPrice?: number;

	@IsNumber()
	credit: number;

	@IsString()
	describtion: string;

	@IsString()
	advantages: string;

	@IsString()
	disAdvantages: string;

	@IsArray()
	@IsString({each: true})
	categories: string[];

	@IsArray()
	@IsString({each: true})
	tags: string[];

	@IsArray()
	@ValidateNested()
    @Type(() => ProductCharasteristicDto)
	chatacteristics: ProductCharasteristicDto[];
}
