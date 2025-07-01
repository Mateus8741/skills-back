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

// src/routes/Services/report-service.ts
var report_service_exports = {};
__export(report_service_exports, {
  ReportService: () => ReportService
});
module.exports = __toCommonJS(report_service_exports);
var import_zod = require("zod");

// src/prisma/prisma-client.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query"]
});

// src/routes/Services/report-service.ts
var ReportSchema = import_zod.z.object({
  serviceId: import_zod.z.string().cuid(),
  reason: import_zod.z.string().min(10, "A raz\xE3o deve ter pelo menos 10 caracteres"),
  description: import_zod.z.string().min(20, "A descri\xE7\xE3o deve ter pelo menos 20 caracteres")
});
async function ReportService(app) {
  app.withTypeProvider().post("/services/report", {
    schema: {
      body: ReportSchema,
      summary: "Report a service problem",
      tags: ["Services"]
    }
  }, async (request, reply) => {
    try {
      const { serviceId, reason, description } = request.body;
      const userId = await request.getCurrentUserId();
      if (!userId) {
        return reply.status(401).send({ message: "Usu\xE1rio n\xE3o autenticado" });
      }
      const service = await prisma.service.findUnique({
        where: { id: serviceId },
        include: {
          User: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      });
      if (!service) {
        return reply.status(404).send({ message: "Servi\xE7o n\xE3o encontrado" });
      }
      const report = await prisma.serviceReport.create({
        data: {
          reason,
          description,
          userId,
          serviceId,
          status: "PENDING"
        },
        include: {
          User: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          },
          Service: {
            select: {
              name: true,
              description: true
            }
          }
        }
      });
      return reply.status(201).send({
        message: "Den\xFAncia enviada com sucesso",
        report
      });
    } catch (error) {
      console.error("Error reporting service:", error);
      return reply.status(500).send({
        message: "Erro ao reportar servi\xE7o",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ReportService
});
