import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from '../../prisma/prisma-client'

export async function GetService(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/service', {
        schema: {
            summary: 'Get all services',
            tags: ['Services'],
        }
    }, async (request, reply) => {
        try {
            const services = await prisma.service.findMany({
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
                price: service.price,
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
            console.error('Error fetching services:', error)
            
            if (error instanceof Error && error.message.includes('unauthorized')) {
                return reply.status(401).send({
                    message: 'Usuário não autenticado'
                })
            }

            return reply.status(500).send({
                message: 'Erro ao buscar serviços'
            })
        }
    })
}
