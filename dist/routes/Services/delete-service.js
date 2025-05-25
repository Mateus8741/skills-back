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

// src/routes/Services/delete-service.ts
var delete_service_exports = {};
__export(delete_service_exports, {
  DeleteService: () => DeleteService
});
module.exports = __toCommonJS(delete_service_exports);
var import_zod = require("zod");

// src/prisma/prisma-client.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query"]
});

// src/routes/Services/delete-service.ts
async function DeleteService(app) {
  app.withTypeProvider().delete("/service/:serviceId", {
    schema: {
      params: import_zod.z.object({
        serviceId: import_zod.z.string().cuid()
      }),
      summary: "Delete a service by id",
      tags: ["Services"]
    }
  }, async (request, reply) => {
    const { serviceId } = request.params;
    const userId = await request.getCurrentUserId();
    if (!userId) {
      return reply.status(401).send({ error: "Usu\xE1rio n\xE3o autenticado" });
    }
    const service = await prisma.service.findFirst({
      where: {
        id: serviceId,
        userId
      },
      include: {
        serviceLocation: true
      }
    });
    if (!service) {
      return reply.status(404).send({ error: "Servi\xE7o n\xE3o encontrado" });
    }
    await prisma.serviceLocation.deleteMany({
      where: {
        serviceId
      }
    });
    await prisma.service.delete({
      where: {
        id: serviceId
      }
    });
    return reply.status(204).send();
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DeleteService
});
