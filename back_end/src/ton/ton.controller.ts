import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { TonService } from './ton.service';
import { CreatePackageDto } from './dto/createPackage.dto';
import { DepositDto } from './dto/deposit.dto';
import { buyPackageDto } from './dto/buyPackage.dto';

@Controller('ton')
export class TonController {
  constructor(private tonService: TonService) {}

  @Post('create')
  async createTonPackage(@Body() body: CreatePackageDto) {
    return await this.tonService.createTonPackage(body);
  }

  @Get('all')
  async getAll() {
    return await this.tonService.getAll();
  }

  @Post('deposit')
  async deposit(@Body() body: DepositDto) {
    return await this.tonService.deposit(body);
  }

  @Post('buyPackage')
  async buyPackage(@Body() body: buyPackageDto) {
    return await this.tonService.buyPackage(body);
  }
}
