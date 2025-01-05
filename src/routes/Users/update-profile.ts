import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../prisma/prisma-client'

const UpdateProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().email().optional(),
  location: z.object({
    street: z.string().optional(),
    neighborhood: z.string().optional(),
    houseNumber: z.number().optional(),
    complement: z.string().optional(),
    reference: z.string().optional(),
  }).optional(),
})

export async function UpdateProfile(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put('/users/profile', {
    schema: {
      body: UpdateProfileSchema,
      summary: 'Update user profile',
      tags: ['Users'],
    }
  }, async (request, reply) => {
    try {
      const userId = await request.getCurrentUserId()
      const updateData = request.body

      if (!userId) {
        return reply.status(401).send({ message: 'Usuário não autenticado' })
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { location: true }
      })

      if (!user) {
        return reply.status(404).send({ message: 'Usuário não encontrado' })
      }

      if (updateData.email && updateData.email !== user.email) {
        const existingUser = await prisma.user.findFirst({
          where: { 
            email: updateData.email,
            NOT: { id: userId }
          }
        })

        if (existingUser) {
          return reply.status(400).send({ message: 'Email já está em uso' })
        }
      }

      const updatedUser = await prisma.$transaction(async (tx) => {
        if (updateData.location) {
          await tx.location.update({
            where: { id: user.location[0].id },
            data: updateData.location
          })
        }

        const { location, ...userData } = updateData

        return tx.user.update({
          where: { id: userId },
          data: userData,
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
            isAuthenticated: true,
            rating: true,
            location: true
          }
        })
      })

      return reply.status(200).send({
        message: 'Perfil atualizado com sucesso',
        user: updatedUser
      })

    } catch (error) {
      console.error('Error updating profile:', error)
      return reply.status(500).send({ 
        message: 'Erro ao atualizar perfil',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      })
    }
  })
} 