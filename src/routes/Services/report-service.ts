import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../prisma/prisma-client'

const ReportSchema = z.object({
  serviceId: z.string().cuid(),
  reason: z.string().min(10, 'A razão deve ter pelo menos 10 caracteres'),
  description: z.string().min(20, 'A descrição deve ter pelo menos 20 caracteres'),
})

export async function ReportService(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/services/report', {
    schema: {
      body: ReportSchema,
      summary: 'Report a service problem',
      tags: ['Services'],
    }
  }, async (request, reply) => {
    try {
      const { serviceId, reason, description } = request.body
      const userId = await request.getCurrentUserId()

      if (!userId) {
        return reply.status(401).send({ message: 'Usuário não autenticado' })
      }

      const service = await prisma.service.findUnique({
        where: { id: serviceId },
        include: {
          User: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      })

      if (!service) {
        return reply.status(404).send({ message: 'Serviço não encontrado' })
      }

      const report = await prisma.serviceReport.create({
        data: {
          reason,
          description,
          userId,
          serviceId,
          status: 'PENDING'
        },
        include: {
          User: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          },
          Service: {
            select: {
              name: true,
              description: true
            }
          }
        }
      })

      return reply.status(201).send({
        message: 'Denúncia enviada com sucesso',
        report
      })

    } catch (error) {
      console.error('Error reporting service:', error)
      return reply.status(500).send({ 
        message: 'Erro ao reportar serviço',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      })
    }
  })
} 