import { Controller, Post, Body, Get, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { GetRawHeaders } from './decorators/get-raw-headers.decoratos';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces/valid-roles-interface';
import { Auth } from './decorators/auth.decorator';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  
  constructor(private readonly authService: AuthService) {}
  
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
  
  @Post('login')
  login(@Body() loginAuthDto: LoginUserDto) {
    return this.authService.login(loginAuthDto);
  }


  @ApiResponse({ status: 200, description: 'Return ok, user, userEmail rawHeaders' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('test')
  @UseGuards(AuthGuard())
  testPrivateRoute(    
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @GetRawHeaders() rawHeaders: string[]
  ){    
    return {
      ok: true,
      user,
      userEmail,
      rawHeaders,
    }
  }  
  @ApiResponse({ status: 200, description: 'Return ok, user' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  // @SetMetadata('roles', ['admin', 'superuser'])
  @Get('test2')
  @RoleProtected(ValidRoles.superuser, ValidRoles.admin)
  @UseGuards(AuthGuard(), UserRoleGuard)
  testPrivateRoute2(    
    @GetUser() user: User,
    // @GetUser('email') userEmail: string,
    // @GetRawHeaders() rawHeaders: string[]
  ){    
    return {
      ok: true,
      user
    }
  }  

  @ApiResponse({ status: 200, description: 'Return ok, user' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('test3')
  @Auth(ValidRoles.all)
  testPrivateRoute3(    
    @GetUser() user: User,   
  ){    
    return {
      ok: true,
      user
    }
  }  

  @ApiResponse({ status: 200, description: 'Return user and new token' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('check-status')
  @Auth(ValidRoles.all)
  checkAuthStatus(
    @GetUser() user: User
  ){
    return this.authService.checkAuthStatus(user)
  }


}
