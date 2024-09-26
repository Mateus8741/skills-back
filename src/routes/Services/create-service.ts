import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from '../../prisma/prisma-client'
import { ServiceSchema } from '../../schemas/register-service-schema'

export async function CreateService(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/service-create', {
    schema: {
        body: ServiceSchema,
        summary: 'Create a new service',
        tags: ['Services'],
    }
  }, async (request, reply) => {
    try {
        const { category, description, location, name, price } = request.body
        const userId = await request.getCurrentUserId()

        const user = await prisma.user.findFirst({
            where: {
                id: userId,
            },
        })

        if (!user) {
            return reply.status(404).send({
                message: 'User not found',
            })
        }

        await prisma.service.create({
            data: {
                category,
                description,
                serviceLocation: {
                    create: {
                        city: location.city,
                        number: location.number,
                        state: location.state,
                        street: location.street,
                    },
                },
                name,
                price,
                userId,
            },
        })

        return reply.status(200).send({
            message: 'Serviço criado com sucesso',
          })
    } catch (error) {
        console.error(error)
        
        return reply.status(500).send({
            message: 'Erro ao criar serviço',
        })
    }
  })
}
