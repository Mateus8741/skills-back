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
        const refreshToken = request.cookies.refreshToken

        if (!refreshToken) {
          return reply.status(401).send({
            message: 'Refresh token não fornecido',
          })
        }

        // Verificar se o refresh token é válido
        const decoded = await request.jwtVerify<{ sub: string, type: string }>({ 
          onlyCookie: true 
        })

        if (decoded.type !== 'refresh_token') {
          return reply.status(401).send({
            message: 'Token inválido',
          })
        }

        // Verificar se o refresh token existe no banco
        const user = await prisma.user.findFirst({
          where: {
            id: decoded.sub,
            refreshToken,
          },
        })

        if (!user) {
          return reply.status(401).send({
            message: 'Token inválido',
          })
        }

        // Gerar novo access token
        const accessToken = await reply.jwtSign(
          {
            sub: user.id,
            type: 'access_token'
          },
          {
            expiresIn: '15m',
          }
        )

        // Gerar novo refresh token
        const newRefreshToken = await reply.jwtSign(
          {
            sub: user.id,
            type: 'refresh_token'
          },
          {
            expiresIn: '7d',
          }
        )

        // Atualizar refresh token no banco
        await prisma.user.update({
          where: { id: user.id },
          data: { refreshToken: newRefreshToken }
        })

        // Atualizar cookie
        reply.setCookie('refreshToken', newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 7 dias
        })

        return reply.status(200).send({
          accessToken,
        })
        
      } catch (error) {
        console.error('Error on refresh token', error)
        
        return reply.status(401).send({
          message: 'Token inválido',
        })
      }
    }
  )
} 