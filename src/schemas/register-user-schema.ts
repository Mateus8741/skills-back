import { number, z } from 'zod';

const RegisterSchema = z.object({
  firstName: z.string().min(2, 'Nome muito curto').max(50, 'Nome muito longo'),
  lastName: z.string().min(2, 'Sobrenome muito curto').max(50, 'Sobrenome muito longo'),
  email: z.string().email('Email inválido'),
  number: number().positive().int(),
  location: z.object({
    street: z.string().min(2, 'Nome da rua muito curto').max(50, 'Nome da rua muito longo'),
    city: z.string().min(2, 'Nome da cidade muito curto').max(50, 'Nome da cidade muito longo'),
    state: z.string().length(2, 'Estado deve ter 2 caracteres'),
    houseNumber: number().positive('Número deve ser positivo').int().min(1, 'Número da casa deve ser maior que 0'),
  }),
  isAuthenticated: z.boolean().default(false),
  password: z.string().min(6, 'Senha muito curta').max(15, 'Senha muito longa'),
})

const LoginSchema = RegisterSchema.partial()

export { LoginSchema, RegisterSchema };

