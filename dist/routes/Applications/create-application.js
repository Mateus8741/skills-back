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

// src/routes/Applications/create-application.ts
var create_application_exports = {};
__export(create_application_exports, {
  CreateApplication: () => CreateApplication
});
module.exports = __toCommonJS(create_application_exports);
var import_zod = require("zod");

// src/prisma/prisma-client.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query"]
});

// src/routes/Applications/create-application.ts
async function CreateApplication(app) {
  app.withTypeProvider().post("/applications", {
    schema: {
      body: import_zod.z.object({
        serviceId: import_zod.z.string().cuid()
      }),
      summary: "Create a new application",
      tags: ["Applications"]
    }
  }, async (request, reply) => {
    try {
      const { serviceId } = request.body;
      const userId = await request.getCurrentUserId();
      if (!userId) {
        return reply.status(401).send({ message: "Usu\xE1rio n\xE3o autenticado" });
      }
      const service = await prisma.service.findUnique({
        where: { id: serviceId }
      });
      if (!service) {
        return reply.status(404).send({ message: "Servi\xE7o n\xE3o encontrado" });
      }
      if (service.userId === userId) {
        return reply.status(400).send({
          message: "Voc\xEA n\xE3o pode se candidatar ao seu pr\xF3prio servi\xE7o"
        });
      }
      const existingApplication = await prisma.application.findFirst({
        where: {
          AND: [
            { userId },
            { serviceId }
          ]
        }
      });
      if (existingApplication) {
        return reply.status(400).send({
          message: "Voc\xEA j\xE1 se candidatou a este servi\xE7o"
        });
      }
      const application = await prisma.application.create({
        data: {
          userId,
          serviceId,
          status: "PENDING"
        },
        include: {
          Service: {
            include: {
              serviceLocation: true,
              User: {
                select: {
                  firstName: true,
                  lastName: true,
                  phoneNumber: true
                }
              }
            }
          }
        }
      });
      return reply.status(201).send({
        message: "Candidatura realizada com sucesso",
        application
      });
    } catch (error) {
      console.error("Error creating application:", error);
      return reply.status(500).send({
        message: "Erro ao criar candidatura",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CreateApplication
});
