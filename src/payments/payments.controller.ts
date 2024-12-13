import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { TossPaymentDto } from './dto/tossPayments.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('/success')
  async success(@Res() res: Response) {
    console.log(join(__dirname, '..', '..', 'public', 'success.html'));
    res.sendFile(join(__dirname, '..', '..', 'public', 'success.html'));
  }

  @Get('fail')
  fail(@Res() res: Response) {
    console.log('asdfasdfasdfasdf');
    console.log(join(__dirname, '..', '..', 'public', 'fail.html'));
    res.sendFile(join(__dirname, '..', '..', 'public', 'fail.html'));
  }

  @Post('toss')
  tossPayments(@Body() tossPaymentDto: TossPaymentDto) {
    return this.paymentsService.tossPayment(tossPaymentDto);
  }
}
