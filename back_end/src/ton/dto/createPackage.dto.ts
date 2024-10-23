import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePackageDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  price: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  duration: number;
}
