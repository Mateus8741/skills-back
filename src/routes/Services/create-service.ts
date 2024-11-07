import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from '../../prisma/prisma-client'
import { ServiceSchema } from '../../schemas/register-service-schema'

export async function CreateService(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/service', {
    schema: {
      body: ServiceSchema,
      summary: 'Create a new service',
      tags: ['Services'],
    }
  }, async (request, reply) => {
    try {
      const { 
        category, 
        description, 
        location,
        name, 
        price 
      } = request.body
      const userId = await request.getCurrentUserId()

      const user = await prisma.user.findFirst({
        where: { id: userId },
      })

      if (!user) {
        return reply.status(404).send({
          message: 'User not found',
        })
      }

      const service = await prisma.service.create({
        data: {
          name,
          description,
          price: Number(price),
          category,
          userPhoneNumber: user.phoneNumber,
          rating: 0,
          isAuthenticaded: false,
          userId: user.id,
          serviceLocation: {
            createMany: {
              data: [ location ],
            },
          }
        },
        include: {
          serviceLocation: true
        }
      })

      return reply.status(201).send({
        message: 'Serviço criado com sucesso',
        service
      })
    } catch (error) {
      console.error(error)
      
      return reply.status(500).send({
        message: 'Erro ao criar serviço',
      })
    }
  })
}
