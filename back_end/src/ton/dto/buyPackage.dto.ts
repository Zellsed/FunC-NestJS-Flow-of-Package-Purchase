import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class Wallet {
  @IsNotEmpty()
  account?: {
    address?: string;
    publicKey?: string;
  };
}

export class buyPackageDto {
  @IsNotEmpty()
  wallet: Wallet;

  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  price: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  duration: number;
}
