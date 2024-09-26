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

        const service = await prisma.service.findMany({
            where: {
                userId,
            },
        })

        return reply.status(200).send(service)
    })
}
