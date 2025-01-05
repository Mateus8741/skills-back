import bcrypt from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../prisma/prisma-client'

const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(6, 'A senha atual deve ter pelo menos 6 caracteres'),
  newPassword: z.string().min(6, 'A nova senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'A confirmação de senha deve ter pelo menos 6 caracteres'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})

export async function ChangePassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().patch('/users/change-password', {
    schema: {
      body: ChangePasswordSchema,
      summary: 'Change user password',
      tags: ['Users'],
    }
  }, async (request, reply) => {
    try {
      const { currentPassword, newPassword } = request.body
      const userId = await request.getCurrentUserId()

      if (!userId) {
        return reply.status(401).send({ message: 'Usuário não autenticado' })
      }

      const user = await prisma.user.findUnique({
        where: { id: userId }
      })

      if (!user) {
        return reply.status(404).send({ message: 'Usuário não encontrado' })
      }

      const passwordMatch = await bcrypt.compare(currentPassword, user.password)

      if (!passwordMatch) {
        return reply.status(400).send({ message: 'Senha atual incorreta' })
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10)

      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword }
      })

      return reply.status(200).send({
        message: 'Senha alterada com sucesso'
      })

    } catch (error) {
      console.error('Error changing password:', error)
      return reply.status(500).send({ 
        message: 'Erro ao alterar senha',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      })
    }
  })
} 