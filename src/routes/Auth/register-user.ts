import bcrypt from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from '../../prisma/prisma-client'
import { RegisterSchema } from '../../schemas/register-user-schema'

export async function RegisterUser(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/register', {
        schema: {
            body: RegisterSchema,
            summary: 'Register a new user',
            tags: ['Auth'],
        },
    }, async (request, reply) => {
       try {
        const { email,firstName,isAuthenticated,lastName,location,phoneNumber,password } = request.body
        const {houseNumber,neighborhood,street,complement,reference,} = location

        const alreadyExistsSameEmail = await prisma.user.findFirst({
            where: {
                email,
            },
        })

        if (alreadyExistsSameEmail) {
            return reply.status(400).send({
                message: 'Usuário já cadastrado',
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await prisma.user.create({
            data: {
                email,
                firstName,
                lastName,
                isAuthenticated,
                location: {
                    create: {
                        houseNumber,
                        neighborhood,
                        street,
                        complement: complement || '',
                        reference: reference || '',
                    },
                },
                phoneNumber,
                password: hashedPassword,
            },
        })

        return reply.status(201).send({
            message: 'Usuário cadastrado com sucesso',
        })

       } catch (error) {
        console.error('Error on register user', error)

        return reply.status(500).send({
            message: 'Erro ao cadastrar usuário',
        })
       }
    })
}
