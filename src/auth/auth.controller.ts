import { Controller, Get, Post, Body, UseGuards, Req, Headers, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { RawHeaders } from './decorators/raw-headers.decorator';
import { IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from './guards/user-tole/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces/valid-roles';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post("login")
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get("check-status")
  @Auth()
  checkAuthStatus(
    @GetUser() user: User
  ){
    return this.authService.checkAuthStatus(user)
  }

  @Get("privateone")
  @UseGuards(AuthGuard())
  testingPrivateRouteOne(
    @Req() request:Express.Request,
    @GetUser() user: User,
    @GetUser() userEmail: User,
    @RawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders
  ){

    return {
      ok:true,
      userEmail,
      user,
      rawHeaders,
      headers
    }
  }

  // @SetMetadata("roles", ["admin","super-user"])
  @Get("privatetwo")
  @RoleProtected(ValidRoles.superUser, ValidRoles.admin, ValidRoles.user)
  @UseGuards(AuthGuard(), UserRoleGuard)
  testingPrivateRouteTwo(
    @GetUser() user: User,
  ){

    return {
      ok:true,
      user,
    }
  }

  @Get("privatethree")
  @Auth(ValidRoles.admin)
  testingPrivateRouteThree(
    @GetUser() user: User,
  ){

    return {
      ok:true,
      user,
    }
  }


}
