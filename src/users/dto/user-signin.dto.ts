import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class UserSignInDto{
  @IsNotEmpty({ message: 'email can not be empty.' })
  @IsEmail({}, { message: 'Please provide a valid email.' })
  email: string;

  @IsNotEmpty({ message: 'Password can not be empty.' })
  @MinLength(5, { message: 'Password minimun character should be 5.' })
  password: string;
}

