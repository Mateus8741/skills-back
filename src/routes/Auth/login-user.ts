import bcrypt from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import type { infer as ZodInfer } from 'zod'
import { prisma } from '../../prisma/prisma-client'
import {
  LoginSchema,
  type RegisterSchema,
} from '../../schemas/register-user-schema'

export async function LoginUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/login',
    {
      schema: {
        body: LoginSchema,
        summary: 'Login user',
        tags: ['Auth'],
      },
    },
    async (request, reply) => {
      try {
        const { email, password } = request.body as ZodInfer<
          typeof RegisterSchema
        >

        const user = await prisma.user.findFirst({
          where: {
            email,
          },
        })

        if (!user) {
          return reply.status(404).send({
            message: 'Credenciais inválidas',
          })
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
          return reply.status(401).send({
            message: 'Credenciais inválidas',
          })
        }

        // Gerar access token (curta duração - 15min)
        const accessToken = await reply.jwtSign(
          {
            sub: user.id,
            type: 'access_token'
          },
          {
            expiresIn: '15552000s',
          }
        )

        // Gerar refresh token (longa duração - 7 dias)
        const refreshToken = await reply.jwtSign(
          {
            sub: user.id,
            type: 'refresh_token'
          },
          {
            expiresIn: '15552000s',
          }
        )

        // Salvar refresh token no banco
        await prisma.user.update({
          where: { id: user.id },
          data: { refreshToken }
        })

        // Configurar cookie seguro com o refresh token
        reply.setCookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
          maxAge: 6 * 30 * 24 * 60 * 60,
        })

        return reply.status(200).send({
          accessToken,
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            isAuthenticated: user.isAuthenticated,
            rating: user.rating,
          },
        })
        
      } catch (error) {
        console.error('Error on login user', error)
        
        return reply.status(500).send({
          message: 'Erro interno',
        })
      }
    }
  )
}
