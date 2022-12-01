import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { FastifyInstance } from 'fastify'
import { authenticate } from '../plugins/authenticate'

export async function gameRoutes(fastify: FastifyInstance) {

  //listagem de jogos de um bolão
  fastify.get('/pools/:id/games', {
    onRequest: [authenticate],
  }, async (request) => {
    const getPoolParams = z.object({
      id: z.string()
    })

    //id será usado para identificar o palpite do(a) user no bolão pois, um(a) participante pode participar de vários boções e fazer palpites diferentes para o mesmo jogo (EX: Bolão1: time A [1] X time B [0]; Bolão 2: time A [0] x time B [1] )
    const { id } = getPoolParams.parse(request.params)

    const games = await prisma.game.findMany({
      orderBy: {
        date: 'desc',
      },
      //retorna se o user já criou um palpite para esse jogo nesse bolão
      //OBS: user não pode dar mais de um palpite dentro de UM bolão
      include: {
        guesses: {
          where: {
            participant: {
              userId: request.user.sub,
              poolId: id,
            }
          }
        }
      }
    })

    return {
      games: games.map(game => {
        return {
          ...game, // retorna todas as informações que JÁ existem dentro do game
          guess: game.guesses.length > 0 ? game.guesses[0] : null,
          guesses: undefined
        }
      })
    }

    /**
     * antes
     * return { games }
     */
  })
}