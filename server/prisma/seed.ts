import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {

  //criando usuário
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      avatarUrl: 'https://github.com/diego3g.png'
    }
  })


  const pool = await prisma.pool.create({
    data: {
      title: 'Example Pool',
      code: 'BOL123',
      ownerId: user.id,

      //fazendo com que o user que é dono do bolão acima tambem esteja participando do bolão e não so sendo proprietário
      // forma 2
      participants: {
        create: {
          userId: user.id
        }
      }
    }
  })

  //fazendo com que o user que é dono do bolão acima tambem esteja participando do bolão e não so sendo proprietário
  // forma 1
  // const participant = await prisma.participant.create({
  //   data: {
  //     poolId: pool.id,
  //     userId: user.id
  //   }
  // })

  await prisma.game.create({
    data: {
      date: '2022-11-02T12:00:00.121Z', //TimeStamp
      firstTeamCountryCode: 'DE',
      secondTeamCountryCode: 'BR'
    }
  })

  await prisma.game.create({
    data: {
      date: '2022-11-03T12:00:00.121Z', //TimeStamp
      firstTeamCountryCode: 'BR',
      secondTeamCountryCode: 'AR',

      guesses: {
        create: {
          firstTeamPoints: 2,
          secontTeamPoints: 1,

          participant: {
            connect: {
              userId_poolId: {
                userId: user.id,
                poolId: pool.id
              }
            }
          }
        }
      }
    }
  })
}

main()