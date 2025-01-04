import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { TossPaymentDto } from './dto/tossPayments.dto';
import { PaymentsService } from './payments.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('/success')
  @ApiOperation({ summary: 'Payment success page' })
  @ApiResponse({ status: 200, description: 'Returns the success page.' })
  async success(@Res() res: Response) {
    console.log(join(__dirname, '..', '..', 'public', 'success.html'));
    res.sendFile(join(__dirname, '..', '..', 'public', 'success.html'));
  }

  @Get('fail')
  @ApiOperation({ summary: 'Payment failure page' })
  @ApiResponse({ status: 200, description: 'Returns the failure page.' })
  fail(@Res() res: Response) {
    console.log('asdfasdfasdfasdf');
    console.log(join(__dirname, '..', '..', 'public', 'fail.html'));
    res.sendFile(join(__dirname, '..', '..', 'public', 'fail.html'));
  }

  @Post('toss')
  @ApiOperation({ summary: 'Process Toss payment' })
  @ApiBody({
    description: 'Toss payment payload',
    type: TossPaymentDto,
    examples: {
      example1: {
        summary: 'Example payload',
        value: {
          amount: 1000,
          orderId: 'order123',
          paymentKey: 'key123',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Payment processed successfully.' })
  tossPayments(@Body() tossPaymentDto: TossPaymentDto) {
    return this.paymentsService.tossPayment(tossPaymentDto);
  }
}
