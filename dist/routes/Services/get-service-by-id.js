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

// src/routes/Services/get-service-by-id.ts
var get_service_by_id_exports = {};
__export(get_service_by_id_exports, {
  GetServiceById: () => GetServiceById
});
module.exports = __toCommonJS(get_service_by_id_exports);
var import_zod = require("zod");

// src/prisma/prisma-client.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query"]
});

// src/routes/Services/get-service-by-id.ts
async function GetServiceById(app) {
  app.withTypeProvider().get("/service/:serviceId", {
    schema: {
      params: import_zod.z.object({
        serviceId: import_zod.z.string().cuid()
      }),
      summary: "Get a service by id",
      tags: ["Services"]
    }
  }, async (request, reply) => {
    const { serviceId } = request.params;
    const userId = request.getCurrentUserId();
    if (!userId) {
      return reply.status(401).send({ error: "Usu\xE1rio n\xE3o autenticado" });
    }
    const service = await prisma.service.findFirst({
      where: {
        id: serviceId
      },
      include: {
        serviceLocation: true,
        User: {
          select: {
            phoneNumber: true
          }
        }
      }
    });
    if (!service) {
      return reply.status(404).send({ error: "Servi\xE7o n\xE3o encontrado" });
    }
    const formattedService = {
      ...service,
      price: service.price.toString(),
      location: service.serviceLocation[0],
      userPhoneNumber: service.User.phoneNumber
    };
    return reply.status(200).send(formattedService);
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetServiceById
});
