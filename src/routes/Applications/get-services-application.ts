import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../prisma/prisma-client'

export async function GetServiceApplications(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/service/:serviceId/applications', {
    schema: {
      params: z.object({
        serviceId: z.string().cuid(),
      }),
      summary: 'Get all applications for a service',
      tags: ['Applications'],
    }
  }, async (request, reply) => {
    try {
      const { serviceId } = request.params
      const userId = await request.getCurrentUserId()

      // Verificar se o usuário é o dono do serviço
      const service = await prisma.service.findFirst({
        where: {
          id: serviceId,
          userId,
        },
      })

      if (!service) {
        return reply.status(403).send({ 
          message: 'Você não tem permissão para ver as candidaturas deste serviço' 
        })
      }

      // Buscar todas as candidaturas com dados dos candidatos
      const applications = await prisma.application.findMany({
        where: {
          serviceId,
        },
        include: {
          User: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phoneNumber: true,
              rating: true,
              isAuthenticated: true,
              location: true,
            }
          },
          Service: {
            select: {
              name: true,
              description: true,
              price: true,
              category: true,
              rating: true,
              serviceLocation: true,
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
        candidate: {
          id: app.User.id,
          name: `${app.User.firstName} ${app.User.lastName}`,
          email: app.User.email,
          phoneNumber: app.User.phoneNumber,
          rating: app.User.rating,
          isAuthenticated: app.User.isAuthenticated,
          location: app.User.location[0],
        },
        service: {
          name: app.Service.name,
          description: app.Service.description,
          price: app.Service.price,
          category: app.Service.category,
          rating: app.Service.rating,
          location: app.Service.serviceLocation[0],
        }
      }))

      return reply.status(200).send(formattedApplications)
    } catch (error) {
      console.error('Error fetching applications:', error)
      return reply.status(500).send({ message: 'Erro ao buscar candidaturas' })
    }
  })
}