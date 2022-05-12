import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDTO } from 'src/auth/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async login(dto: AuthDTO) {
    let user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ForbiddenException('Credentials incorrect');

    const valid = await argon.verify(user.hash, dto.password);
    if (!valid) throw new ForbiddenException('Credentials incorrect');

    return {
      token: await this.signToken(user.id, user.email),
    };
  }

  async signup(dto: AuthDTO) {
    // generate the password hash
    const hash = await argon.hash(dto.password);

    // save new user in the db
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });
      return { token: await this.signToken(user.id, user.email) };
    } catch (err) {
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new ForbiddenException('Credentials taken');
      }
      throw err;
    }
    // return saved User
  }

  async signToken(userId: number, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');
    return await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret,
    });
  }
}
