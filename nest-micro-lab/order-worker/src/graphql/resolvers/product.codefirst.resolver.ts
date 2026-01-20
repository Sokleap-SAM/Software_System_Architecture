import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ProductType } from '../types/product.type';
import { CreateProductInput } from '../inputs/create-product.input';
import { CategoryType } from '../types/category.type';
import { ProductService } from 'src/modules/products/product.service';
import { CategoryService } from 'src/modules/category/category.service';

@Resolver(() => ProductType)
export class ProductCodeFirstResolver {
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
  ) {}

  @Query(() => [ProductType])
  products() {
    return this.productService.findAll();
  }

  @Query(() => ProductType, { nullable: true })
  product(@Args('id') id: string) {
    return this.productService.findOne(id);
  }

  @Query(() => [ProductType])
  productsByCategory(@Args('categoryId') categoryId: string) {
    return this.productService.productByCategory(categoryId);
  }

  @Mutation(() => ProductType)
  createProduct(@Args('input') input: CreateProductInput) {
    return this.productService.create({
      ...input,
      categoryId: input.categoryId,
    });
  }

  @ResolveField(() => CategoryType, { nullable: true })
  category(@Parent() product: ProductType) {
    return this.categoryService.findOne(product.categoryId.toString());
  }
}
