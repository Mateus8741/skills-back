import { z } from 'zod';

const ChangeSchema = z.object({
    old_password: z.string().min(6),
    new_password: z.string().min(6),
})

export { ChangeSchema };

