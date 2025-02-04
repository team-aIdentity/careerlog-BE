import { BadRequestException, Injectable } from '@nestjs/common';
import { TossPaymentDto } from './dto/tossPayments.dto';
import axios from 'axios';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class PaymentsService {
  private readonly tossURL = 'https://api.tosspayments.com/v1/payments/confirm';
  private readonly secretKey = process.env.TOSS_SECRET_KEY;

  constructor(private readonly productService: ProductService) {}

  async tossPayment(tossPaymentDto: TossPaymentDto) {
    console.log('>>>>>>>>>', this.secretKey);
    const { orderId, amount, paymentKey, cartId } = tossPaymentDto;

    try {
      await this.productService.checkBought(cartId);
      const response = await axios.post(
        `${this.tossURL}`,
        {
          orderId,
          amount,
          paymentKey,
        },
        {
          headers: {
            Authorization: `Basic ${Buffer.from(`${this.secretKey}:`).toString('base64')}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return {
        title: '결제 성공',
        body: response.data,
      };
    } catch (error) {
      throw new BadRequestException({ message: '결제 실패', data: error });
    }
  }
}
