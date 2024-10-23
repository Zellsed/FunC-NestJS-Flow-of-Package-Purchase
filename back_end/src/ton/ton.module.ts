import { Module } from '@nestjs/common';
import { TonController } from './ton.controller';
import { TonService } from './ton.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreatePackage } from './entities/createTon.entity';
import { NetworkProvider } from '@ton-community/blueprint';
import { DepositEntity } from './entities/deposit.entity';
import { BuyPackageEntity } from './entities/buyPackage.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CreatePackage, DepositEntity, BuyPackageEntity]),
  ],
  controllers: [TonController],
  providers: [TonService],
})
export class TonModule {}
