import { Category, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.user.deleteMany()
  await prisma.service.deleteMany()
  await prisma.serviceLocation.deleteMany()
  await prisma.location.deleteMany()

  const user1 = await prisma.user.create({
    data: {
      firstName: 'João',
      lastName: 'Silva',
      email: 'joao@example.com',
      password: '123456',
      phoneNumber: '11999999999',
      isAuthenticated: true,
      rating: 4.5,
      location: {
        create: {
          street: 'Rua das Flores',
          neighborhood: 'Centro',
          complement: 'Apto 101',
          reference: 'Próximo ao mercado',
          houseNumber: 123,
        }
      }
    }
  })

  const user2 = await prisma.user.create({
    data: {
      firstName: 'Maria',
      lastName: 'Santos',
      email: 'maria@example.com',
      password: '123456',
      phoneNumber: '11988888888',
      isAuthenticated: true,
      rating: 4.8,
      location: {
        create: {
          street: 'Avenida Principal',
          neighborhood: 'Jardim América',
          complement: 'Casa',
          reference: 'Próximo à farmácia',
          houseNumber: 456,
        }
      }
    }
  })

  await prisma.service.create({
    data: {
      name: 'Instalação Elétrica',
      description: 'Serviço completo de instalação elétrica residencial',
      price: 150.00,
      category: Category.ELECTRICIAN,
      userPhoneNumber: user1.phoneNumber,
      rating: 4.7,
      isAuthenticaded: false,
      userId: user1.id,
      serviceLocation: {
        create: {
          city: 'São Paulo',
          state: 'SP',
          street: 'Rua dos Eletricistas',
          neighborhood: 'Vila Nova',
          complement: 'Sala 3',
          reference: 'Próximo ao posto de gasolina',
          number: 789,
          latitude: -23.550520,
          longitude: -46.633308,
        }
      }
    }
  })

  await prisma.service.create({
    data: {
      name: 'Pintura Residencial',
      description: 'Pintura completa de casas e apartamentos',
      price: 200.00,
      category: Category.PAINTER,
      userPhoneNumber: user1.phoneNumber,
      rating: 4.5,
      isAuthenticaded: true,
      userId: user1.id,
      serviceLocation: {
        create: {
          city: 'São Paulo',
          state: 'SP',
          street: 'Rua dos Pintores',
          neighborhood: 'Jardim Paulista',
          complement: '',
          reference: 'Próximo à praça',
          number: 321,
          latitude: -23.561778,
          longitude: -46.655293,
        }
      }
    }
  })

  await prisma.service.create({
    data: {
      name: 'Limpeza Residencial',
      description: 'Limpeza completa de residências',
      price: 120.00,
      category: Category.CLEANER,
      userPhoneNumber: user2.phoneNumber,
      rating: 4.9,
      isAuthenticaded: true,
      userId: user2.id,
      serviceLocation: {
        create: {
          city: 'São Paulo',
          state: 'SP',
          street: 'Rua da Limpeza',
          neighborhood: 'Moema',
          complement: 'Casa 2',
          reference: 'Próximo ao shopping',
          number: 654,
          latitude: -23.571778,
          longitude: -46.665293,
        }
      }
    }
  })

  await prisma.service.create({
    data: {
      name: 'Jardinagem Profissional',
      description: 'Manutenção completa de jardins',
      price: 180.00,
      category: Category.GARDENER,
      userPhoneNumber: user2.phoneNumber,
      rating: 4.6,
      isAuthenticaded: true,
      userId: user2.id,
      serviceLocation: {
        create: {
          city: 'São Paulo',
          state: 'SP',
          street: 'Rua dos Jardins',
          neighborhood: 'Pinheiros',
          complement: '',
          reference: 'Próximo ao parque',
          number: 987,
          latitude: -23.581778,
          longitude: -46.675293,
        }
      }
    }
  })

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 