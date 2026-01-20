import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CategoryService } from 'src/modules/category/category.service';

@Resolver('Category') // <-- matches schema type name
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query('categories') // <-- matches schema query name
  async categories() {
    return await this.categoryService.findAll(); // you already have (or students implement)
  }

  @Mutation('createCategory')
  async createCategory(@Args('name') name: string) {
    return await this.categoryService.create({ name });
  }
}
