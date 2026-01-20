import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from './dto/entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @Inject('PRODUCT_REPO')
    private readonly productRepo: Repository<Product>,
  ) {}

  async create(data: Partial<Product>): Promise<Product> {
    const product = this.productRepo.create(data);
    return await this.productRepo.save(product);
  }

  async findAll(): Promise<Product[]> {
    // Added 'category' relation so you can see category details in the list
    return await this.productRepo.find({
      relations: ['category'],
    });
  }

  async findOne(id: string): Promise<Product> {
    // Using findOne instead of findOneBy to include relations
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    return product;
  }

  async productByCategory(categoryId: string): Promise<Product[]> {
    return await this.productRepo.find({
      where: { categoryId },
      relations: ['category'],
    });
  }

  async update(id: string, data: Partial<Product>): Promise<Product> {
    const product = await this.productRepo.preload({
      id,
      ...data,
    });

    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    return await this.productRepo.save(product);
  }

  async remove(id: string): Promise<void> {
    const result = await this.productRepo.delete(id);
    if (result.affected === 0) {
      // Fixed: error message now refers to Product
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
  }
}
