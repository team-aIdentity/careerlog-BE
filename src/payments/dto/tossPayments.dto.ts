import { IsNotEmpty } from 'class-validator';

export class TossPaymentDto {
  @IsNotEmpty()
  paymentKey: string;

  @IsNotEmpty()
  orderId: string;

  @IsNotEmpty()
  amount: number;
}
