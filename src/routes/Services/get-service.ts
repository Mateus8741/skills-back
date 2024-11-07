import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from '../../prisma/prisma-client'

export async function GetService(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/service', {
        schema: {
            summary: 'Get a service',
            tags: ['Services'],
        }
    }, async (request, reply) => {
        const userId = await request.getCurrentUserId()

        if (!userId) {
            return reply.status(401).send({
                message: 'Não autorizado',
            })
        }

        const services = await prisma.service.findMany({
            where: {
                userId,
            },
            include: {
                serviceLocation: true,
                User: {
                    select: {
                        phoneNumber: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        const formattedServices = services.map(service => ({
            ...service,
            price: service.price.toString(),
            location: service.serviceLocation[0],
            userPhoneNumber: service.User.phoneNumber,
        }))

        return reply.status(200).send(formattedServices)
    })
}
