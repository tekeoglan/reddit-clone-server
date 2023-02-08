import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import * as session from 'express-session';
import * as connectPgSimple from 'connect-pg-simple';
import { Client } from 'pg';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: [
        'http://localhost:5173',
        'http://localhost:4173',
        'https://reddit-clone-client-tekeoglan.vercel.app',
      ],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    },
  });
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  const conObject = {
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: parseInt(process.env.PG_PORT || '0'),
  };

  const client = new Client(conObject);
  client.connect();

  const pgStore = new (connectPgSimple(session))({ conObject });

  const options = {
    store: pgStore,
    secret: process.env.SESSION_SECRET || '',
    saveUninitialized: false,
    resave: false,
    cookie: {
      secure: false,
      httpOnly: false,
      sameSite: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  };
  app.use(session(options));

  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
