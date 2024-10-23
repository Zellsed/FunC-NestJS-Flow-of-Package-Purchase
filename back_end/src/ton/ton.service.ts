import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePackage } from './entities/createTon.entity';
import { Repository } from 'typeorm';
import { CreatePackageDto } from './dto/createPackage.dto';
import { Address, OpenedContract, TonClient } from 'ton';
import { getHttpEndpoint } from '@orbs-network/ton-access';
import { TonContract } from 'src/contract/wrappers/TonContract';
import { DepositDto } from './dto/deposit.dto';
import { DepositEntity } from './entities/deposit.entity';
import { buyPackageDto } from './dto/buyPackage.dto';
import { BuyPackageEntity } from './entities/buyPackage.entity';

@Injectable()
export class TonService {
  private client: TonClient;

  constructor(
    @InjectRepository(CreatePackage)
    private tonRepository: Repository<CreatePackage>,
    @InjectRepository(DepositEntity)
    private depositRepository: Repository<DepositEntity>,
    @InjectRepository(BuyPackageEntity)
    private buyPackageRepository: Repository<BuyPackageEntity>,
  ) {}

  async createTonPackage(body: CreatePackageDto) {
    return await this.tonRepository.save(body);
  }

  async getAll() {
    return await this.tonRepository.find();
  }

  async deposit(body: DepositDto) {
    const { wallet, amount } = body;
    const ingredientWallet = await wallet;

    const address = ingredientWallet?.account?.address;
    const publicKey = ingredientWallet?.account?.publicKey;

    return await this.depositRepository.save({
      address,
      publicKey,
      amount,
    });
  }

  async buyPackage(body: buyPackageDto) {
    const { wallet, id, name, price, description, duration } = body;
    const ingredientWallet = await wallet;

    const address = ingredientWallet?.account?.address;
    const publicKey = ingredientWallet?.account?.publicKey;

    return await this.buyPackageRepository.save({
      address,
      publicKey,
      id_Package: id,
      name,
      price,
      description,
      duration,
    });
  }
}
