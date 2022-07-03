import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { Serialize } from 'src/interceptors';
import { CreateUserDto, UpdateUserDto, UserDto } from 'src/users/dtos';
import { UsersService } from './users.service';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  listUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Get(':id')
  findUser(@Param('id') id: string) {
    return this.usersService.findOne(parseInt(id));
  }

  @Post('signup')
  createUser(@Body() body: CreateUserDto) {
    const { email, password } = body;
    return this.usersService.create(email, password);
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }
}
