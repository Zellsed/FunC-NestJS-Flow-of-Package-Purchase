import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class Wallet {
  @IsNotEmpty()
  account?: {
    address?: string;
    publicKey?: string;
  };
}

export class DepositDto {
  @IsNotEmpty()
  wallet: Wallet;

  @IsString()
  @IsNotEmpty()
  amount: string;
}
