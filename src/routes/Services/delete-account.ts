import bcrypt from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from '../../prisma/prisma-client'
import { DeleteAccountSchema } from '../../schemas/delete-accoung-shema'



export async function DeleteAccount(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete('/users/account', {
    schema: {
      body: DeleteAccountSchema,
      summary: 'Delete user account',
      tags: ['Users'],
    }
  }, async (request, reply) => {
    try {
      const { password } = request.body
      const userId = await request.getCurrentUserId()

      if (!userId) {
        return reply.status(401).send({ message: 'Usuário não autenticado' })
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          Service: {
            include: {
              serviceLocation: true,
              Application: true
            }
          },
          location: true,
          Application: true
        }
      })

      if (!user) {
        return reply.status(404).send({ message: 'Usuário não encontrado' })
      }

      // Verificar se a senha está correta
      const passwordMatch = await bcrypt.compare(password, user.password)

      if (!passwordMatch) {
        return reply.status(400).send({ message: 'Senha incorreta' })
      }

      // Deletar todos os dados do usuário em uma transação
      await prisma.$transaction(async (tx) => {
        // Deletar todas as applications do usuário
        await tx.application.deleteMany({
          where: { userId }
        })

        // Deletar todas as locations dos serviços do usuário
        await tx.serviceLocation.deleteMany({
          where: {
            serviceId: {
              in: user.Service.map(service => service.id)
            }
          }
        })

        // Deletar todos os serviços do usuário
        await tx.service.deleteMany({
          where: { userId }
        })

        // Deletar todas as locations do usuário
        await tx.location.deleteMany({
          where: { userId }
        })

        // Deletar todos os reports do usuário
        await tx.serviceReport.deleteMany({
          where: { userId }
        })

        // Por fim, deletar o usuário
        await tx.user.delete({
          where: { id: userId }
        })
      })

      return reply.status(200).send({
        message: 'Conta excluída com sucesso'
      })

    } catch (error) {
      console.error('Error deleting account:', error)
      return reply.status(500).send({ 
        message: 'Erro ao excluir conta',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      })
    }
  })
}
