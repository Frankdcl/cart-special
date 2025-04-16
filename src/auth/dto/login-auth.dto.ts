import { PartialType } from '@nestjs/mapped-types';
import {  CreateUserDto } from './create-auth.dto';
import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class LoginUserDto extends PartialType(CreateUserDto) {

    @IsString()
    @IsEmail()    
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

}
