import { z } from 'zod'
import Fastify from "fastify";
import cors from '@fastify/cors';
import ShortUniqueId from 'short-unique-id';
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

  fastfy.get('/users/count', async () => {
    const count = await prisma.user.count()

    return { count }
  })

  fastfy.get('/guesses/count', async () => {
    const count = await prisma.guess.count()

    return { count }
  })

  //criar um bolão
  fastfy.post('/pools', async (request, reply) => {
    const createPoolBody = z.object({
      title: z.string(),
    })

    const { title } = createPoolBody.parse(request.body)

    const generate = new ShortUniqueId({ length: 6 })
    const code = String(generate()).toLocaleUpperCase()

    await prisma.pool.create({
      data: {
        title,
        code
      }
    })

    reply.status(201).send({ code })
  })


  await fastfy.listen({ port: 3333, host: '0.0.0.0' })
}

bootstrap()