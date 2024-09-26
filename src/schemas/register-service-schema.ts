import { number, z } from 'zod';

const ServiceSchema = z.object({
    name: z.string().min(2, 'Nome muito curto').max(50, 'Nome muito longo'),
    description: z.string().min(2, 'Descrição muito curta').max(50, 'Descrição muito longa'),
    category: z.string().min(2, 'Categoria muito curta').max(50, 'Categoria muito longa'),
    price: number().positive(),
    location: z.object({
        street: z.string().min(2, 'Nome da rua muito curto').max(50, 'Nome da rua muito longo'),
        city: z.string().min(2, 'Nome da cidade muito curto').max(50, 'Nome da cidade muito longo'),
        state: z.string().length(2, 'Estado deve ter 2 caracteres'),
        number: number().positive('Número deve ser positivo').int().optional().default(0),
    }),
})

export { ServiceSchema };

