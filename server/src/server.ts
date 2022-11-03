import Fastify from "fastify";
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query'],
})

//1° fnc que vai ser executada
async function bootstrap() {
  const fastfy = Fastify({
    logger: true
  })

  await fastfy.register(cors, { origin: true })

  fastfy.get('/pools/count', async () => {
    const count = await prisma.pool.count()

    return { count }
  })

  await fastfy.listen({ port: 3333, host: '0.0.0.0' })
}

bootstrap()