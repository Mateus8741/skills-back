import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from '../../prisma/prisma-client'

export async function GetUserServices(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/user/services', {
    schema: {
      summary: 'Get all services published by the logged user',
      tags: ['Services'],
    }
  }, async (request, reply) => {
    try {
      const userId = await request.getCurrentUserId()

      if (!userId) {
        return reply.status(401).send({ message: 'Usuário não autenticado' })
      }

      const services = await prisma.service.findMany({
        where: {
          userId: userId
        },
        include: {
          serviceLocation: true,
          User: {
            select: {
              phoneNumber: true,
              firstName: true,
              lastName: true,
              rating: true,
              isAuthenticated: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      const formattedServices = services.map(service => ({
        id: service.id,
        name: service.name,
        description: service.description,
        price: service.price.toString(),
        category: service.category,
        rating: service.rating,
        isAuthenticaded: service.isAuthenticaded,
        createdAt: service.createdAt,
        location: service.serviceLocation[0],
        userPhoneNumber: service.User.phoneNumber,
        provider: {
          firstName: service.User.firstName,
          lastName: service.User.lastName,
          rating: service.User.rating,
          isAuthenticated: service.User.isAuthenticated
        }
      }))

      return reply.status(200).send(formattedServices)
    } catch (error) {
      console.error('Error fetching user services:', error)
      return reply.status(500).send({ 
        message: 'Erro ao buscar serviços do usuário',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      })
    }
  })
} 