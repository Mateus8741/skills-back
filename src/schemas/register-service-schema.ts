import { number, z } from 'zod';

export const Category = z.enum ([
    'ELECTRICIAN',
    'PAINTER',
    'BRICKLAYER',
    'GARDENER',
    'PLUMBER',
    'CLEANER',
    'OTHERS',
  ]).default('OTHERS');

const ServiceSchema = z.object({
    name: z.string().min(2, 'Nome muito curto').max(50, 'Nome muito longo'),
    description: z.string().min(2, 'Descrição muito curta').max(50, 'Descrição muito longa'),
    category: Category,
    price: number().positive(),
    location: z.object({
        city: z.string().min(2, 'Nome da cidade muito curto').max(50, 'Nome da cidade muito longo'),
        state: z.string().length(2, 'Estado deve ter 2 caracteres'),
        street: z.string().min(2, 'Nome da rua muito curto').max(50, 'Nome da rua muito longo'),
        neighborhood: z.string().min(2, 'Nome do bairro muito curto').max(50, 'Nome do bairro muito longo'),
        complement: z.string().optional().default(''),
        reference: z.string().optional().default(''),
        number: number().positive('Número deve ser positivo').int().optional().default(0),
        latitude: number().default(0),
        longitude: number().default(0),
    }),
})

export { ServiceSchema };

