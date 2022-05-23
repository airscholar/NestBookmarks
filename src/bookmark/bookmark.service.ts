import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { CreateBookmarkDTO } from './dto/create-bookmark.dto';
import { UpdateBookmarkDTO } from './dto/update-bookmark.dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async getBookmarks(userId: number) {
    return await this.prisma.bookmark.findMany({
      where: {
        userId,
      },
    });
  }

  async getBookmarkById(userId: number, id: number) {
    return await this.prisma.bookmark.findFirst({
      where: { id, userId },
    });
  }

  async createBookmark(userId: number, dto: CreateBookmarkDTO) {
    return await this.prisma.bookmark.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async updateBookmarkById(userId: number, id: number, dto: UpdateBookmarkDTO) {
    const bookmark = await this.getBookmark(userId, id);

    return await this.prisma.bookmark.update({
      where: { id: bookmark.id },
      data: {
        ...dto,
      },
    });
  }

  async getBookmark(userId: number, id: number) {
    const bookmark = await this.prisma.bookmark.findFirst({
      where: { id },
    });

    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException('Access to resource denied!');

    return bookmark;
  }
  async deleteBookmarkById(userId: number, id: number) {
    const bookmark = await this.getBookmark(userId, id);

    return await this.prisma.bookmark.delete({
      where: { id: bookmark.id },
    });
  }
}
