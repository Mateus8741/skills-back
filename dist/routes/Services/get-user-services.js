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

// src/routes/Services/get-user-services.ts
var get_user_services_exports = {};
__export(get_user_services_exports, {
  GetUserServices: () => GetUserServices
});
module.exports = __toCommonJS(get_user_services_exports);

// src/prisma/prisma-client.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query"]
});

// src/routes/Services/get-user-services.ts
async function GetUserServices(app) {
  app.withTypeProvider().get("/user/services", {
    schema: {
      summary: "Get all services published by the logged user",
      tags: ["Services"]
    }
  }, async (request, reply) => {
    try {
      const userId = await request.getCurrentUserId();
      if (!userId) {
        return reply.status(401).send({ message: "Usu\xE1rio n\xE3o autenticado" });
      }
      const services = await prisma.service.findMany({
        where: {
          userId
        },
        include: {
          serviceLocation: true,
          User: {
            select: {
              phoneNumber: true,
              firstName: true,
              lastName: true,
              rating: true,
              isAuthenticated: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      });
      const formattedServices = services.map((service) => ({
        id: service.id,
        name: service.name,
        description: service.description,
        price: service.price.toString(),
        category: service.category,
        rating: service.rating,
        isAuthenticaded: service.isAuthenticaded,
        createdAt: service.createdAt,
        location: service.serviceLocation[0],
        userPhoneNumber: service.User.phoneNumber,
        provider: {
          firstName: service.User.firstName,
          lastName: service.User.lastName,
          rating: service.User.rating,
          isAuthenticated: service.User.isAuthenticated
        }
      }));
      return reply.status(200).send(formattedServices);
    } catch (error) {
      console.error("Error fetching user services:", error);
      return reply.status(500).send({
        message: "Erro ao buscar servi\xE7os do usu\xE1rio",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetUserServices
});
