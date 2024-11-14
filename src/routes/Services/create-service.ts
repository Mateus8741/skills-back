import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../prisma/prisma-client'
import { ServiceSchema } from '../../schemas/register-service-schema'

export async function CreateService(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/service', {
    schema: {
      body: z.array(ServiceSchema),
      summary: 'Create new services',
      tags: ['Services'],
    }
  }, async (request, reply) => {
    try {
      const services = request.body
      const userId = await request.getCurrentUserId()

      const user = await prisma.user.findFirst({
        where: { id: userId },
      })

      if (!user) {
        return reply.status(404).send({
          message: 'User not found',
        })
      }

      const createdServices = await prisma.$transaction(
        services.map(service => {
          const { category, description, location, name, price } = service
          
          return prisma.service.create({
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
                create: {
                  city: location.city,
                  state: location.state,
                  street: location.street,
                  complement: location.complement,
                  neighborhood: location.neighborhood,
                  reference: location.reference,
                  number: location.number,
                  latitude: location.latitude,
                  longitude: location.longitude
                }
              }
            },
            include: {
              serviceLocation: true
            }
          })
        })
      )

      return reply.status(201).send({
        message: 'Serviços criados com sucesso',
        services: createdServices
      })
    } catch (error) {
      console.error(error)
      
      return reply.status(500).send({
        message: 'Erro ao criar serviços',
      })
    }
  })
}
