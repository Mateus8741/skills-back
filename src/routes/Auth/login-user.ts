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
        summary: 'Register a new user',
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

        const token = await reply.jwtSign(
            {
                sub: user.id,
            },
            {
                expiresIn: '1h',
            }
        )

        return reply.status(200).send({
            token,
            user,
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
