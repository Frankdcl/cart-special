import { Controller, Post, Body, Get, Param, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { Auth } from './decorator/auth.decorator.ts.decorator';
import { GetUser } from './decorator/get-user.decorator';
import { User } from './entities/user.entity';
import { Response } from 'express';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
async login(@Body() loginUserDto: LoginUserDto) {
  const { token, user } = await this.authService.login(loginUserDto);

  return {
    success: true,
    token,
    user,
    redirectTo: 'public/dashboard.html'
  };
}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Get('private')
  @Auth()
  privatePath (){
    return 'Si estas autorizado';
  }

}
