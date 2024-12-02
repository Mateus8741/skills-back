import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../prisma/prisma-client'

export async function UpdateApplicationStatus(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().patch('/applications/:applicationId/status', {
    schema: {
      params: z.object({
        applicationId: z.string().cuid(),
      }),
      body: z.object({
        status: z.enum(['ACCEPTED', 'REJECTED']),
      }),
      summary: 'Update application status',
      tags: ['Applications'],
    }
  }, async (request, reply) => {
    try {
      const { applicationId } = request.params
      const { status } = request.body
      const userId = await request.getCurrentUserId()

      // Verificar se o usuário é o dono do serviço
      const application = await prisma.application.findFirst({
        where: {
          id: applicationId,
        },
        include: {
          Service: {
            select: {
              userId: true,
            }
          }
        }
      })

      if (!application || application.Service.userId !== userId) {
        return reply.status(403).send({ 
          message: 'Você não tem permissão para atualizar esta candidatura' 
        })
      }

      // Atualizar o status
      const updatedApplication = await prisma.application.update({
        where: {
          id: applicationId,
        },
        data: {
          status,
        },
        include: {
          User: true,
          Service: true,
        }
      })

      return reply.status(200).send({
        message: `Candidatura ${status === 'ACCEPTED' ? 'aceita' : 'rejeitada'} com sucesso`,
        application: updatedApplication,
      })
    } catch (error) {
      console.error('Error updating application status:', error)
      return reply.status(500).send({ message: 'Erro ao atualizar status da candidatura' })
    }
  })
} 