import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../prisma/prisma-client'

export async function GetServiceById(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/service/:serviceId', {
    schema: {
        params: z.object({
            serviceId: z.string().cuid(),
        }),
        summary: 'Get a service by id',
        tags: ['Services'],
    }
  }, async (request, reply) => {
    const { serviceId } = request.params
    const userId = request.getCurrentUserId()

    if (!userId) {
        return reply.status(401).send({ error: "Usuário não autenticado" });
    }

    const service = await prisma.service.findFirst({
      where: {
        id: serviceId,
      },
      include: {
        serviceLocation: true,
        User: {
          select: {
            phoneNumber: true
          }
        }
      }
    })

    if (!service) {
      return reply.status(404).send({ error: "Serviço não encontrado" });
    }

    const formattedService = {
      ...service,
      price: service.price.toString(),
      location: service.serviceLocation[0],
      userPhoneNumber: service.User.phoneNumber,
    }

    return reply.status(200).send(formattedService)
  })
}
