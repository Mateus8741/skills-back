import { z } from 'zod';

const RegisterSchema = z.object({
  firstName: z.string().min(2, 'Nome muito curto').max(50, 'Nome muito longo'),
  lastName: z.string().min(2, 'Sobrenome muito curto').max(50, 'Sobrenome muito longo'),
  email: z.string().email('Email inválido'),
  phoneNumber: z.string(),
  location: z.object({
    street: z.string().min(2, 'Nome da rua muito curto').max(50, 'Nome da rua muito longo'),
    neighborhood: z
      .string()
      .min(2, 'Nome do bairro muito curto')
      .max(50, 'Nome do bairro muito longo'),
    complement: z.string().optional(),
    reference: z.string().optional(),
    houseNumber: z
      .number()
      .min(1, 'Número da casa deve ser maior que 0')
      .int(),
  }),
  isAuthenticated: z.boolean().default(false),
  password: z.string().min(6, 'Senha muito curta').max(15, 'Senha muito longa'),
})

const LoginSchema = RegisterSchema.partial()

export { LoginSchema, RegisterSchema };

