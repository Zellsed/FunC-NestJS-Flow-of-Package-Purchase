import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TonModule } from './ton/ton.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreatePackage } from './ton/entities/createTon.entity';
import { DepositEntity } from './ton/entities/deposit.entity';
import { BuyPackageEntity } from './ton/entities/buyPackage.entity';

@Module({
  imports: [
    TonModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'ton',
      entities: [CreatePackage, DepositEntity, BuyPackageEntity],
      synchronize: true,
    }),
    TonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
