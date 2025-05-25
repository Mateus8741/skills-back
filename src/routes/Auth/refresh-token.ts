import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from '../../prisma/prisma-client'

export async function RefreshToken(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/refresh',
    {
      schema: {
        summary: 'Refresh access token',
        tags: ['Auth'],
      },
    },
    async (request, reply) => {
      try {
        await request.jwtVerify({ onlyCookie: true })

        const userId = await request.getCurrentUserId()

        if (!userId) {
          return reply.status(401).send({
            message: 'Usuário não encontrado',
          })
        }

        const token = await reply.jwtSign(
          {
            sign: {
              sub: userId,
              expiresIn: '30d',
            },
          }
        )

        const refreshToken = await reply.jwtSign(
          {
            sign: {
              sub: userId,
              expiresIn: '30d',
            },
          }
        )

        await prisma.user.update({
          where: { id: userId },
          data: { refreshToken }
        })

        return reply
          .setCookie('refreshToken', refreshToken, {
            path: '/',
            secure: true,
            sameSite: true,
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 30, 
          })
          .status(200)
          .send({
            token,
          })

      } catch (error) {
        console.error('Error on refresh token:', error)
        return reply.status(401).send({
          message: 'Token inválido',
        })
      }
    }
  )
} 