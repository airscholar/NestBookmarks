import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDTO } from 'src/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  login() {}

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
      delete user.hash;
      return user;
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
}
