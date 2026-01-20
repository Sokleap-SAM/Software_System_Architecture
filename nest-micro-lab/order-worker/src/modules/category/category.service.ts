import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('CATEGORY_REPO')
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async create(data: Partial<Category>): Promise<Category> {
    const category = this.categoryRepo.create(data);
    return await this.categoryRepo.save(category);
  }

  async findAll(): Promise<Category[]> {
    // Added 'relations' to see products attached to categories
    return await this.categoryRepo.find({
      relations: ['products'],
    });
  }

  async findOne(id: string): Promise<Category> {
    // Use 'findOne' with relations if you need the product list for a single category
    const category = await this.categoryRepo.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }

    return category;
  }

  async update(id: string, data: Partial<Category>): Promise<Category> {
    const category = await this.categoryRepo.preload({
      id, // TypeORM matches the string ID to the UUID column automatically
      ...data,
    });

    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }

    return await this.categoryRepo.save(category);
  }

  async remove(id: string): Promise<void> {
    const result = await this.categoryRepo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }
  }
}
