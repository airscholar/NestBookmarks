import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { EditUserDTO } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser(userId: number, dto: EditUserDTO) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...dto,
      },
    });
  }
}
