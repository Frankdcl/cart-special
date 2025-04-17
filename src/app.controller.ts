// app.controller.ts
import { Controller, Get, Options, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  @Get()
  redirectToLogin(@Res() res: Response) {
    return res.redirect('public/login.html');
  }
  
  // en AppController o uno separado
  @Options('*')
  handleOptions(@Res() res: Response) {
    res.set({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    return res.status(204).send();
  }

  
}