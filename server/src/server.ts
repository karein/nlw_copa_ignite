import Fastify from "fastify";
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';

import { poolRoutes } from './routes/pool';
import { userRoutes } from './routes/user';
import { guessRoutes } from './routes/guess';
import { gameRoutes } from './routes/game';
import { authRoutes } from './routes/auth';

//1° fnc que vai ser executada
async function bootstrap() {
  const fastfy = Fastify({
    logger: true
  })

  await fastfy.register(jwt, {
    secret: 'nlwcopa'
  })

  await fastfy.register(cors, { origin: true })

  await fastfy.register(authRoutes)
  await fastfy.register(gameRoutes)
  await fastfy.register(guessRoutes)
  await fastfy.register(poolRoutes)
  await fastfy.register(userRoutes)

  await fastfy.listen({ port: 3333, host: '0.0.0.0' })
}

bootstrap()