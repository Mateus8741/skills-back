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

// src/routes/Users/change-password.ts
var change_password_exports = {};
__export(change_password_exports, {
  ChangePassword: () => ChangePassword
});
module.exports = __toCommonJS(change_password_exports);
var import_bcryptjs = __toESM(require("bcryptjs"));
var import_zod = require("zod");

// src/prisma/prisma-client.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query"]
});

// src/routes/Users/change-password.ts
var ChangePasswordSchema = import_zod.z.object({
  currentPassword: import_zod.z.string().min(6, "A senha atual deve ter pelo menos 6 caracteres"),
  newPassword: import_zod.z.string().min(6, "A nova senha deve ter pelo menos 6 caracteres"),
  confirmPassword: import_zod.z.string().min(6, "A confirma\xE7\xE3o de senha deve ter pelo menos 6 caracteres")
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "As senhas n\xE3o coincidem",
  path: ["confirmPassword"]
});
async function ChangePassword(app) {
  app.withTypeProvider().patch("/users/change-password", {
    schema: {
      body: ChangePasswordSchema,
      summary: "Change user password",
      tags: ["Users"]
    }
  }, async (request, reply) => {
    try {
      const { currentPassword, newPassword } = request.body;
      const userId = await request.getCurrentUserId();
      if (!userId) {
        return reply.status(401).send({ message: "Usu\xE1rio n\xE3o autenticado" });
      }
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });
      if (!user) {
        return reply.status(404).send({ message: "Usu\xE1rio n\xE3o encontrado" });
      }
      const passwordMatch = await import_bcryptjs.default.compare(currentPassword, user.password);
      if (!passwordMatch) {
        return reply.status(400).send({ message: "Senha atual incorreta" });
      }
      const hashedPassword = await import_bcryptjs.default.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword }
      });
      return reply.status(200).send({
        message: "Senha alterada com sucesso"
      });
    } catch (error) {
      console.error("Error changing password:", error);
      return reply.status(500).send({
        message: "Erro ao alterar senha",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ChangePassword
});
