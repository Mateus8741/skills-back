import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../prisma/prisma-client'

export async function DeleteService(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .delete('/service/:serviceId', {
        schema: {
            params: z.object({
                serviceId: z.string().cuid(),
            }),
            summary: 'Delete a service by id',
            tags: ['Services'],
        }
    }, async (request, reply) => {
        const { serviceId } = request.params
        const userId = await request.getCurrentUserId()

        if (!userId) {
            return reply.status(401).send({ error: "Usuário não autenticado" });
        }

        const service = await prisma.service.findFirst({
            where: {
                id: serviceId,
                userId,
            },
            include: {
                serviceLocation: true
            }
        })

        if (!service) {
            return reply.status(404).send({ error: "Serviço não encontrado" });
        }

        await prisma.serviceLocation.deleteMany({
            where: {
                serviceId
            }
        })

        await prisma.service.delete({
            where: {
                id: serviceId,
            },
        })

        return reply.status(204).send()
    })
}
