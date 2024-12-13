import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';

@Controller('payments')
export class PaymentsController {
  @Get('/success')
  success(@Res() res: Response): void {
    console.log(join(__dirname, '..', 'public', 'success.html'));
    res.sendFile(join(__dirname, '..', 'public', 'success.html'));
  }
}
