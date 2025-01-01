import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from '../../prisma/prisma-client'

export async function GetApplications(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/applications', {
    schema: {
      summary: 'Get all applications made by the user',
      tags: ['Applications'],
    }
  }, async (request, reply) => {
    try {
      const userId = await request.getCurrentUserId()

      if (!userId) {
        return reply.status(401).send({ message: 'Usuário não autenticado' })
      }

      // Buscar o usuário primeiro para verificar se existe
      const user = await prisma.user.findUnique({
        where: { id: userId }
      })

      if (!user) {
        return reply.status(404).send({ message: 'Usuário não encontrado' })
      }

      // Buscar todos os serviços que o usuário se candidatou
      const userApplications = await prisma.service.findMany({
        where: {
          Application: {
            some: {
              userId: userId
            }
          }
        },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          category: true,
          rating: true,
          serviceLocation: true,
          User: {
            select: {
              firstName: true,
              lastName: true,
              phoneNumber: true,
            }
          },
          Application: {
            where: {
              userId: userId
            },
            select: {
              id: true,
              status: true,
              createdAt: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      // Formatar os dados para o frontend
      const formattedServices = userApplications.map(service => ({
        id: service.Application[0].id, // ID da candidatura
        status: service.Application[0].status,
        createdAt: service.Application[0].createdAt,
        service: {
          id: service.id,
          name: service.name,
          description: service.description,
          price: service.price,
          category: service.category,
          rating: service.rating,
          location: service.serviceLocation[0],
          provider: {
            firstName: service.User.firstName,
            lastName: service.User.lastName,
            phoneNumber: service.User.phoneNumber,
          }
        }
      }))

      return reply.status(200).send(formattedServices)
    } catch (error) {
      console.error('Error fetching user applications:', error)
      return reply.status(500).send({ 
        message: 'Erro ao buscar candidaturas do usuário',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      })
    }
  })
}