import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { FastifyInstance } from 'fastify'
import { authenticate } from '../plugins/authenticate'

export async function guessRoutes(fastify: FastifyInstance) {
  fastify.get('/guesses/count', async () => {
    const count = await prisma.guess.count()

    return { count }
  })

  //criação de um palpite
  fastify.post('/pools/:poolId/games/:gameId/guesses', {
    onRequest: [authenticate],
  }, async (request, reply) => {
    const createGuessParams = z.object({
      poolId: z.string(),
      gameId: z.string()
    })

    const createGuessBody = z.object({
      firstTeamPoints: z.number(),
      secondTeamPoints: z.number(),
    })

    const { poolId, gameId } = createGuessParams.parse(request.params)
    const { firstTeamPoints, secondTeamPoints } = createGuessBody.parse(request.body)

    const participant = await prisma.participant.findUnique({
      where: {
        //a união de userId e poolId, que juntas formam uma chave única
        userId_poolId: {
          poolId,
          userId: request.user.sub
        }
      }
    })

    //se não existir esse participant, significa que esse user não faz parte desse bolão
    if (!participant) {
      return reply.status(400).send({
        message: "You're not allowed to create a guess inside this pool."
      })
    }

    //se o user já fez um palpite dentro desse jogo, não pode permitir fazer outro
    const guess = await prisma.guess.findUnique({
      where: {
        participantId_gameId: {
          participantId: participant.id,
          gameId,
        }
      }
    })

    if (guess) {
      return reply.status(400).send({
        message: "You're already sent a guess to this game on this pool."
      })
    }

    const game = await prisma.game.findUnique({
      where: {
        id: gameId,
      }
    })

    if (!game) {
      return reply.status(400).send({
        message: "Game not found."
      })
    }

    if (game.date < new Date()) {
      return reply.status(400).send({
        message: "You cannot send guesses after the game date."
      })
    }

    await prisma.guess.create({
      data: {
        gameId,
        participantId: participant.id,
        firstTeamPoints,
        secontTeamPoints: secondTeamPoints //errei o nome
      }
    })

    return reply.status(201).send();
  })
}