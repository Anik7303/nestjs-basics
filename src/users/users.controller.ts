import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Response,
  Session,
  UseGuards,
} from '@nestjs/common';
import { Response as EResponse } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';

import { Serialize } from 'src/interceptors';
import { CreateUserDto, UpdateUserDto, UserDto } from 'src/users/dtos';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('whoami')
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post('signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const { email, password } = body;
    const user = await this.authService.signup(email, password);
    session.userId = user.id;
  }

  @Post('signin')
  async login(
    @Body() body: CreateUserDto,
    @Response({ passthrough: true }) response: EResponse,
    @Session() session: any,
  ) {
    const { email, password } = body;
    const user = await this.authService.signin(email, password);
    response.statusCode = 200;
    session.userId = user.id;
    return user;
  }

  @Get('signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @Get()
  listUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Get(':id')
  findUser(@Param('id') id: string) {
    return this.usersService.findOne(parseInt(id));
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
