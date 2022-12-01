import { FastifyInstance } from 'fastify'
import ShortUniqueId from 'short-unique-id'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { authenticate } from '../plugins/authenticate'

export async function poolRoutes(fastify: FastifyInstance) {
  fastify.get('/pools/count', async () => {
    const count = await prisma.pool.count()

    return { count }
  })

  //criar um bolão
  fastify.post('/pools', async (request, reply) => {
    const createPoolBody = z.object({
      title: z.string(),
    })

    const { title } = createPoolBody.parse(request.body)

    const generate = new ShortUniqueId({ length: 6 })
    const code = String(generate()).toLocaleUpperCase()

    try {
      await request.jwtVerify()

      await prisma.pool.create({
        data: {
          title,
          code,
          ownerId: request.user.sub,

          participants: {
            create: {
              userId: request.user.sub
            }
          }
        }
      })
    } catch {

      await prisma.pool.create({
        data: {
          title,
          code,
        }
      })
    }

    reply.status(201).send({ code })
  })

  //entrar em um bolão
  fastify.post('/pools/join',
    {
      onRequest: [authenticate]
    }, async (request, reply) => {
      const joinPoolBody = z.object({
        code: z.string(),
      })

      const { code } = joinPoolBody.parse(request.body)

      /**
       * busca a lista de participantes onde o Id do participante seja o usuario logado.
       * vai trazer uma lista de participants apenas em que o id do usuario do participante seja igual ao id do usuario logado
       */
      const pool = await prisma.pool.findUnique({
        where: {
          code,
        },
        include: {
          participants: {
            where: {
              userId: request.user.sub
            }
          }
        }
      })

      if (!pool) {
        return reply.status(400).send({
          message: 'Pool not found.'
        })
      }

      //se retornar algum dado, significa que o usuário já participa desse bolão
      if (pool.participants.length > 0) {
        return reply.status(400).send({
          message: 'You already joined this pool.'
        })
      }

      //se o bolão não tiver dono, o 1° user que entrar no bolão vai ser o dono
      if (!pool.ownerId) {
        await prisma.pool.update({
          where: {
            id: pool.id
          },
          data: {
            ownerId: request.user.sub
          }
        })
      }

      //se passar por tudo, vai ser criada a relação com participant
      await prisma.participant.create({
        data: {
          poolId: pool.id,
          userId: request.user.sub
        }
      })

      return reply.status(201).send()
    })

  //bolões que o(a) user participa
  fastify.get('/pools', {
    onRequest: [authenticate]
  }, async (request) => {
    const pools = await prisma.pool.findMany({
      where: {
        participants: {
          some: {
            userId: request.user.sub
          }
        }
      },
      include: {
        _count: {
          select: {
            participants: true
          }
        },
        participants: {
          select: {
            id: true,

            user: {
              select: {
                avatarUrl: true
              }
            }
          },
          take: 4,
        },
        owner: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })

    return { pools }
  })

  //detalhes de um bolão, rota chamada quando o(a) user entra na tela de um bolão específico
  fastify.get('/pools/:id', {
    onRequest: [authenticate],
  }, async (request) => {
    const getPoolParams = z.object({
      id: z.string()
    })

    const { id } = getPoolParams.parse(request.params)

    const pool = await prisma.pool.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            participants: true
          }
        },
        participants: {
          select: {
            id: true,

            user: {
              select: {
                avatarUrl: true
              }
            }
          },
          take: 4,
        },
        owner: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })

    return { pool }

  })

}