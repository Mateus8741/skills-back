"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/routes/Services/delete-account.ts
var delete_account_exports = {};
__export(delete_account_exports, {
  DeleteAccount: () => DeleteAccount
});
module.exports = __toCommonJS(delete_account_exports);
var import_bcryptjs = __toESM(require("bcryptjs"));

// src/prisma/prisma-client.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query"]
});

// src/schemas/delete-accoung-shema.ts
var import_zod = __toESM(require("zod"));
var DeleteAccountSchema = import_zod.default.object({
  password: import_zod.default.string().min(6, "Senha deve ter pelo menos 6 caracteres")
});

// src/routes/Services/delete-account.ts
async function DeleteAccount(app) {
  app.withTypeProvider().delete("/users/account", {
    schema: {
      body: DeleteAccountSchema,
      summary: "Delete user account",
      tags: ["Users"]
    }
  }, async (request, reply) => {
    try {
      const { password } = request.body;
      const userId = await request.getCurrentUserId();
      if (!userId) {
        return reply.status(401).send({ message: "Usu\xE1rio n\xE3o autenticado" });
      }
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          Service: {
            include: {
              serviceLocation: true,
              Application: true
            }
          },
          location: true,
          Application: true
        }
      });
      if (!user) {
        return reply.status(404).send({ message: "Usu\xE1rio n\xE3o encontrado" });
      }
      const passwordMatch = await import_bcryptjs.default.compare(password, user.password);
      if (!passwordMatch) {
        return reply.status(400).send({ message: "Senha incorreta" });
      }
      await prisma.$transaction(async (tx) => {
        await tx.application.deleteMany({
          where: { userId }
        });
        await tx.serviceLocation.deleteMany({
          where: {
            serviceId: {
              in: user.Service.map((service) => service.id)
            }
          }
        });
        await tx.service.deleteMany({
          where: { userId }
        });
        await tx.location.deleteMany({
          where: { userId }
        });
        await tx.serviceReport.deleteMany({
          where: { userId }
        });
        await tx.user.delete({
          where: { id: userId }
        });
      });
      return reply.status(200).send({
        message: "Conta exclu\xEDda com sucesso"
      });
    } catch (error) {
      console.error("Error deleting account:", error);
      return reply.status(500).send({
        message: "Erro ao excluir conta",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DeleteAccount
});
