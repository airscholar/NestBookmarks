import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../../src/auth/decorator/get-user.decorator';
import { JwtGuard } from '../../src/auth/guard';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDTO, UpdateBookmarkDTO } from './dto';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Get()
  async getBookmarks(@GetUser('id') userId: number) {
    return await this.bookmarkService.getBookmarks(userId);
  }

  @Get(':id')
  async getBookmarkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.bookmarkService.getBookmarkById(userId, id);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createBookmark(
    @GetUser('id') userId: number,
    @Body() dto: CreateBookmarkDTO,
  ) {
    return await this.bookmarkService.createBookmark(userId, dto);
  }

  @Patch(':id')
  async updateBookmarkById(
    @GetUser('id') userId: number,
    @Body() dto: UpdateBookmarkDTO,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.bookmarkService.updateBookmarkById(userId, id, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteBookmarkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.bookmarkService.deleteBookmarkById(userId, id);
  }
}
