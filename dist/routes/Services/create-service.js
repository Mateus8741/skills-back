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

// src/routes/Services/create-service.ts
var create_service_exports = {};
__export(create_service_exports, {
  CreateService: () => CreateService
});
module.exports = __toCommonJS(create_service_exports);
var import_zod2 = require("zod");

// src/prisma/prisma-client.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query"]
});

// src/schemas/register-service-schema.ts
var import_zod = require("zod");
var Category = import_zod.z.enum([
  "ELECTRICIAN",
  "PAINTER",
  "BRICKLAYER",
  "GARDENER",
  "PLUMBER",
  "CLEANER",
  "BABYSITTER",
  "OTHERS"
]).default("OTHERS");
var ServiceSchema = import_zod.z.object({
  name: import_zod.z.string().min(2, "Nome muito curto").max(50, "Nome muito longo"),
  description: import_zod.z.string().min(2, "Descri\xE7\xE3o muito curta").max(50, "Descri\xE7\xE3o muito longa"),
  category: Category,
  price: (0, import_zod.number)().positive(),
  location: import_zod.z.object({
    city: import_zod.z.string().min(2, "Nome da cidade muito curto").max(50, "Nome da cidade muito longo"),
    state: import_zod.z.string().length(2, "Estado deve ter 2 caracteres"),
    street: import_zod.z.string().min(2, "Nome da rua muito curto").max(50, "Nome da rua muito longo"),
    neighborhood: import_zod.z.string().min(2, "Nome do bairro muito curto").max(50, "Nome do bairro muito longo"),
    complement: import_zod.z.string().optional().default(""),
    reference: import_zod.z.string().optional().default(""),
    number: (0, import_zod.number)().positive("N\xFAmero deve ser positivo").int().optional().default(0),
    latitude: (0, import_zod.number)().default(0),
    longitude: (0, import_zod.number)().default(0)
  })
});

// src/routes/Services/create-service.ts
async function CreateService(app) {
  app.withTypeProvider().post("/service", {
    schema: {
      body: import_zod2.z.array(ServiceSchema),
      summary: "Create new services",
      tags: ["Services"]
    }
  }, async (request, reply) => {
    try {
      const services = request.body;
      const userId = await request.getCurrentUserId();
      const user = await prisma.user.findFirst({
        where: { id: userId }
      });
      if (!user) {
        return reply.status(404).send({
          message: "User not found"
        });
      }
      const createdServices = await prisma.$transaction(
        services.map((service) => {
          const { category, description, location, name, price } = service;
          return prisma.service.create({
            data: {
              name,
              description,
              price,
              category,
              userPhoneNumber: user.phoneNumber,
              rating: 0,
              isAuthenticaded: false,
              userId: user.id,
              serviceLocation: {
                create: {
                  city: location.city,
                  state: location.state,
                  street: location.street,
                  complement: location.complement,
                  neighborhood: location.neighborhood,
                  reference: location.reference,
                  number: location.number,
                  latitude: location.latitude,
                  longitude: location.longitude
                }
              }
            },
            include: {
              serviceLocation: true
            }
          });
        })
      );
      return reply.status(201).send({
        message: "Servi\xE7os criados com sucesso",
        services: createdServices
      });
    } catch (error) {
      console.error(error);
      if (error instanceof Error && error.message.includes("unauthorized")) {
        return reply.status(401).send({
          message: "Usu\xE1rio n\xE3o autenticado"
        });
      }
      return reply.status(500).send({
        message: "Erro ao criar servi\xE7os"
      });
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CreateService
});
