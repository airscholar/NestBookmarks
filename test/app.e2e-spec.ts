import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { AuthDTO } from '../src/auth/dto';
import { EditUserDTO } from '../src/user/dto';
import { CreateBookmarkDTO } from 'src/bookmark/dto/create-bookmark.dto';
import { UpdateBookmarkDTO } from 'src/bookmark/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.init();
    app.listen(3333);

    prisma = app.get(PrismaService);

    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    const body: AuthDTO = {
      email: 'airscholar@gmail.com',
      password: 'password',
    };
    describe('Signup', () => {
      it('should throw an error if email is empty', async () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ password: body.password })
          .expectStatus(400);
      });
      it('should throw an error if password is empty', async () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ email: body.email })
          .expectStatus(400);
      });
      it('should throw an error if body is empty', async () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });
      it('should signup a user', async () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(body)
          .expectStatus(201);
      });
    });
    describe('Signin', () => {
      it('should throw an error if email is empty', async () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ password: body.password })
          .expectStatus(400);
      });
      it('should throw an error if password is empty', async () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ email: body.email })
          .expectStatus(400);
      });
      it('should throw an error if body is empty', async () => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      });
      it('should signin a user', async () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(body)
          .expectStatus(200)
          .stores('userAT', 'token');
      });
    });
  });

  describe('User', () => {
    describe('getMe', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({ Authorization: `Bearer $S{userAT}` })
          .expectStatus(200);
      });
    });
    describe('Edit user', () => {
      it('should edit user', () => {
        const dto: EditUserDTO = {
          firstName: 'Yusuf',
          lastName: 'Doe',
          email: 'airscholar@gmail.com',
        };

        return pactum
          .spec()
          .patch('/users')
          .withHeaders({ Authorization: `Bearer $S{userAT}` })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.lastName)
          .inspect();
      });
    });
  });

  describe('Bookmark', () => {
    describe('create Bookmark', () => {
      it('should create a new bookmark', () => {
        const dto: CreateBookmarkDTO = {
          link: 'https://www.google.com',
          title: 'Google',
          description: 'Search engine',
          userId: 1,
        };
        return pactum
          .spec()
          .post('/bookmarks')
          .withHeaders({ Authorization: `Bearer $S{userAT}` })
          .withBody(dto)
          .expectStatus(201)
          .expectBodyContains(dto.link)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description)
          .stores('bookmarkId', 'id');
      });
    });

    describe('getBookmarks', () => {
      it('should get all bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({ Authorization: `Bearer $S{userAT}` })
          .expectStatus(200)
          .expectJsonLength(1);
        // .inspect();
      });
    });

    describe('get Bookmark by id', () => {
      it('should get all bookmarks', () => {
        return pactum
          .spec()
          .get(`/bookmarks/{id}`)
          .withPathParams('id', `$S{bookmarkId}`)
          .withHeaders({ Authorization: `Bearer $S{userAT}` })
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}')
          .inspect();
      });
    });
    describe('edit bookmark by id', () => {
      it('should edit bookmark', () => {
        const dto: UpdateBookmarkDTO = {
          link: 'https://www.google.com/search?q=pactum',
          title: 'Updated Google',
          description: 'Updated Search engine',
        };

        return pactum
          .spec()
          .patch(`/bookmarks/{id}`)
          .withHeaders({ Authorization: `Bearer $S{userAT}` })
          .withPathParams('id', `$S{bookmarkId}`)
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.link)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description);
      });
    });
    describe('delete bookmark by id', () => {
      it('should delete bookmark', () => {
        return pactum
          .spec()
          .delete(`/bookmarks/{id}`)
          .withHeaders({ Authorization: `Bearer $S{userAT}` })
          .withPathParams('id', `$S{bookmarkId}`)
          .expectStatus(204)
          // .inspect();
      });

      it('should get empty bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({ Authorization: `Bearer $S{userAT}` })
          .expectStatus(200)
          .expectJsonLength(0);
        // .inspect();
      });
    });
  });
});
