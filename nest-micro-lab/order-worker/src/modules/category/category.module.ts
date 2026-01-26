import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { Category } from './entities/category.entity';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { JwtStrategy } from 'src/strategies/jwt.strategy';

@Module({
  imports: [DatabaseModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService, JwtStrategy],
  exports: [CategoryService],
})
export class CategoryModule {}
