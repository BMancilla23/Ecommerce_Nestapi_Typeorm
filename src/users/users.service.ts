import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserSignupDto} from './dto/user-signup.dto';
import {hash, compare} from 'bcrypt'
import { UserSignInDto } from './dto/user-signin.dto';
import { sign } from 'jsonwebtoken';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ){}

  async signup(userSignupDto:UserSignupDto): Promise<UserEntity>{
    const userExists = await this.findUserByEmail(userSignupDto.email)
    if (userExists) {
      throw new BadRequestException('Email is not available.')
    }
    userSignupDto.password = await hash(userSignupDto.password, 10)
    // const user = this.userRepository.create(userSignupDto);
    let user = this.userRepository.create(userSignupDto);
    user = await this.userRepository.save(user)
    delete user.password
    return user;
  }

  async signin(userSignInDto:UserSignInDto): Promise<UserEntity>{
    const userExists = await this.userRepository.createQueryBuilder('users').addSelect('users.password').where("users.email=:email", {email: userSignInDto.email}).getOne();
    if (!userExists) {
      throw new BadRequestException('Bad credentials')
    }
    const matchPassword = await compare(userSignInDto.password, userExists.password)
    if (!matchPassword) {
      throw new BadRequestException('Bad credentials')
    }
    delete userExists.password
    return userExists;
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({id})
    if (!user) {
      throw new NotFoundException('user not found')
    }
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findUserByEmail(email: string){
    return await this.userRepository.findOneBy({email: email})
  }

  async accessToken(user: UserEntity): Promise<string>{
    return sign({
      id: user.id,
      email: user.email
    }, process.env.ACCESS_TOKEN_SECRET_KEY,{
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME
    })
  }
}
