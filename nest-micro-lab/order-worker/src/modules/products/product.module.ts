import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { Product } from './dto/entities/product.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';

@Module({
  imports: [DatabaseModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
