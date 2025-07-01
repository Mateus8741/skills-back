"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/routes/Users/update-profile.ts
var update_profile_exports = {};
__export(update_profile_exports, {
  UpdateProfile: () => UpdateProfile
});
module.exports = __toCommonJS(update_profile_exports);
var import_zod = require("zod");

// src/prisma/prisma-client.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query"]
});

// src/routes/Users/update-profile.ts
var UpdateProfileSchema = import_zod.z.object({
  firstName: import_zod.z.string().optional(),
  lastName: import_zod.z.string().optional(),
  phoneNumber: import_zod.z.string().optional(),
  email: import_zod.z.string().email().optional(),
  location: import_zod.z.object({
    street: import_zod.z.string().optional(),
    neighborhood: import_zod.z.string().optional(),
    houseNumber: import_zod.z.number().optional(),
    complement: import_zod.z.string().optional(),
    reference: import_zod.z.string().optional()
  }).optional()
});
async function UpdateProfile(app) {
  app.withTypeProvider().put("/users/profile", {
    schema: {
      body: UpdateProfileSchema,
      summary: "Update user profile",
      tags: ["Users"]
    }
  }, async (request, reply) => {
    try {
      const userId = await request.getCurrentUserId();
      const updateData = request.body;
      if (!userId) {
        return reply.status(401).send({ message: "Usu\xE1rio n\xE3o autenticado" });
      }
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { location: true }
      });
      if (!user) {
        return reply.status(404).send({ message: "Usu\xE1rio n\xE3o encontrado" });
      }
      if (updateData.email && updateData.email !== user.email) {
        const existingUser = await prisma.user.findFirst({
          where: {
            email: updateData.email,
            NOT: { id: userId }
          }
        });
        if (existingUser) {
          return reply.status(400).send({ message: "Email j\xE1 est\xE1 em uso" });
        }
      }
      const updatedUser = await prisma.$transaction(async (tx) => {
        if (updateData.location) {
          await tx.location.update({
            where: { id: user.location[0].id },
            data: updateData.location
          });
        }
        const { location, ...userData } = updateData;
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
        });
      });
      return reply.status(200).send({
        message: "Perfil atualizado com sucesso",
        user: updatedUser
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      return reply.status(500).send({
        message: "Erro ao atualizar perfil",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UpdateProfile
});
