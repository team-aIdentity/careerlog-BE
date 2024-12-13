import { BadRequestException, Injectable } from '@nestjs/common';
import { TossPaymentDto } from './dto/tossPayments.dto';
import axios from 'axios';

@Injectable()
export class PaymentsService {
  private readonly tossURL = 'https://api.tosspayments.com/v1/payments';
  private readonly secretKey = process.env.TOSS_SECRET_KEY;

  async tossPayment(tossPaymentDto: TossPaymentDto) {
    console.log('>>>>>>>>>', this.secretKey);
    const { orderId, amount, paymentKey } = tossPaymentDto;

    try {
      const response = await axios.post(
        `${this.tossURL}/${paymentKey}`,
        {
          orderId,
          amount,
        },
        {
          headers: {
            Authorization: `Basic ${Buffer.from(`${this.secretKey}:`).toString()}`,
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
