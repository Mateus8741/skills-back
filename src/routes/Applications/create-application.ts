import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../prisma/prisma-client'

export async function CreateApplication(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/applications', {
    schema: {
      body: z.object({
        serviceId: z.string().cuid(),
      }),
      summary: 'Create a new application',
      tags: ['Applications'],
    }
  }, async (request, reply) => {
    try {
      const { serviceId } = request.body
      const userId = await request.getCurrentUserId()

      if (!userId) {
        return reply.status(401).send({ message: 'Usuário não autenticado' })
      }

      // Verificar se o serviço existe
      const service = await prisma.service.findUnique({
        where: { id: serviceId }
      })

      if (!service) {
        return reply.status(404).send({ message: 'Serviço não encontrado' })
      }

      // Verificar se o usuário não está se candidatando ao próprio serviço
      if (service.userId === userId) {
        return reply.status(400).send({ 
          message: 'Você não pode se candidatar ao seu próprio serviço' 
        })
      }

      // Verificar se já existe uma candidatura
      const existingApplication = await prisma.application.findFirst({
        where: {
          AND: [
            { userId },
            { serviceId }
          ]
        }
      })

      if (existingApplication) {
        return reply.status(400).send({ 
          message: 'Você já se candidatou a este serviço' 
        })
      }

      // Criar a candidatura
      const application = await prisma.application.create({
        data: {
          userId,
          serviceId,
          status: 'PENDING'
        },
        include: {
          Service: {
            include: {
              serviceLocation: true,
              User: {
                select: {
                  firstName: true,
                  lastName: true,
                  phoneNumber: true
                }
              }
            }
          }
        }
      })

      return reply.status(201).send({
        message: 'Candidatura realizada com sucesso',
        application
      })

    } catch (error) {
      console.error('Error creating application:', error)
      return reply.status(500).send({ 
        message: 'Erro ao criar candidatura',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      })
    }
  })
} 