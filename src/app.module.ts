import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { datasourceOptions } from 'database/data-source';
import { UsersModule } from './users/users.module';
import { CurrentUserMiddleware } from './utils/middlewares/current-user.middleware';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [TypeOrmModule.forRoot(datasourceOptions), UsersModule, CategoriesModule, ProductsModule],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CurrentUserMiddleware)
      .forRoutes({path: '*', method: RequestMethod.ALL});
  }
}
