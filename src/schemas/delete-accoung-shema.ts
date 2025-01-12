import z from "zod";

const DeleteAccountSchema = z.object({
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

export { DeleteAccountSchema };
