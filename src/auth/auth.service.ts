import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { BcryptAdapter } from 'src/common/adapters/brcrypt.adapter';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly bcryptAdapter: BcryptAdapter,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // Validación manual de datos (ejemplo)
    if (!createUserDto.email || !createUserDto.password) {
      throw new BadRequestException('Email and password are required');
    }

    try {
      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        password: this.bcryptAdapter.hash(password),
        ...userData,
      });

      await this.userRepository.save(user);
      await this.sendEmailValidation(user.email);

      return {
        ...user,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    // Validación manual de datos
    if (!loginUserDto.email || !loginUserDto.password) {
      throw new BadRequestException('Email and password are required');
    }

    try {
      const { password, email } = loginUserDto;
      const user = await this.userRepository.findOne({
        where: { email },
        select: { email: true, password: true, id: true },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials (email)');
      }

      if (!this.bcryptAdapter.compare(password, user.password)) {
        throw new UnauthorizedException('Invalid credentials (password)');
      }

      return {
        user,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  async sendEmailValidation(email: string): Promise<boolean> {
    try {
      const token = this.jwtService.sign(
        { email, isValidationToken: true },
        { expiresIn: '24h' },
      );

      const html = `
        <h1>Thank for registering</h1>
        <p>Espero que te guste :)</p>
      `;

      return await this.mailService.sendEmail({
        to: email,
        subject: 'Thank',
        htmlBody: html,
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to send validation email');
    }
  }

  private handleDBErrors(error: any): never {
    console.error(error); // Log completo para debugging

    // Errores de PostgreSQL
    if (error.code === '23505') {
      throw new BadRequestException(error.detail || 'Duplicate field value');
    }

    // Errores de validación manual
    if (error instanceof BadRequestException || error instanceof UnauthorizedException) {
      throw error; // Re-lanza errores ya controlados
    }

    // Cualquier otro error inesperado
    throw new InternalServerErrorException('Please check server logs');
  }
}
