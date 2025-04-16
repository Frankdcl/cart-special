// app.controller.ts
import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  @Get()
  redirectToLogin(@Res() res: Response) {
    return res.redirect('public/login.html');
  }
}