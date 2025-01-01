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
      console.log(userId)

      if (!userId) {
        return reply.status(401).send({ message: 'Usuário não autenticado' })
      }

      // Buscar todas as candidaturas feitas pelo usuário
      const applications = await prisma.application.findMany({
        where: {
          userId,
        },
        include: {
          Service: {
            select: {
              name: true,
              description: true,
              price: true,
              category: true,
              rating: true,
              serviceLocation: true,
              User: {
                select: {
                  phoneNumber: true,
                  firstName: true,
                  lastName: true,
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      // Formatar os dados para o frontend
      const formattedApplications = applications.map(app => ({
        id: app.id,
        status: app.status,
        createdAt: app.createdAt,
        service: {
          name: app.Service.name,
          description: app.Service.description,
          price: app.Service.price,
          category: app.Service.category,
          rating: app.Service.rating,
          location: app.Service.serviceLocation[0],
          provider: {
            firstName: app.Service.User.firstName,
            lastName: app.Service.User.lastName,
            phoneNumber: app.Service.User.phoneNumber,
          }
        }
      }))

      return reply.status(200).send(formattedApplications)
    } catch (error) {
      console.error('Error fetching user applications:', error)
      return reply.status(500).send({ message: 'Erro ao buscar candidaturas do usuário' })
    }
  })
}