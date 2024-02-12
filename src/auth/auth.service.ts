import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hashSync, compareSync } from 'bcrypt'
import { LoginUserDto } from './dto/login-user.dto';
import { JWTPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {

  private readonly logger = new Logger('AuthService')
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,

  ) { }

  private getJwtToken(payload: JWTPayload) {
    const token = this.jwtService.sign(payload)
    return token;
  }

  async register(createUserDto: CreateUserDto) {
    try {

      const { password, ...userData } = createUserDto

      const user = this.userRepository.create({
        ...userData,
        password: hashSync(password, 10)
      })
      await this.userRepository.save(user);
      delete user.password;

      return {
        ...user,
        token: this.getJwtToken({ id: user.id })
      };

    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async login(loginAuthDto: LoginUserDto) {

    const { password, email } = loginAuthDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { id: true, password: true }
    })

    if (!user) {
      throw new UnauthorizedException('Not valid creadentials')
    }

    if (!compareSync(password, user.password)) {
      throw new UnauthorizedException('Not valid creadentials')
    }
    delete user.password;

    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    };
  }

  checkAuthStatus(user: User) {
    const token = this.getJwtToken({ id: user.id })

    return {
      ...user,
      token
    }
  }

  private handleExceptions(error: any): never {
    if (error.code === '23505')

      throw new BadRequestException(error.detail)

    this.logger.error(error)
    throw new InternalServerErrorException("Unexpected error, check log on console server.")
  }
}
