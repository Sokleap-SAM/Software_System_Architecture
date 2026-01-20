import { Module } from '@nestjs/common';

import { CategoryModule } from 'src/modules/category/category.module';
import { ProductModule } from 'src/modules/products/product.module';
import { CategoryCodeFirstResolver } from './resolvers/category.codefirst.resolver';
import { ProductCodeFirstResolver } from './resolvers/product.codefirst.resolver';
// import { CategoryResolver } from './resolvers/category.resolver';
// import { ProductResolver } from './resolvers/product.resolver';

@Module({
  imports: [CategoryModule, ProductModule],
  providers: [
    // CategoryResolver,
    CategoryCodeFirstResolver,
    // ProductResolver,
    ProductCodeFirstResolver,
  ],
})
export class AppGraphqlModule {}
