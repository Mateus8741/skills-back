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

// src/routes/Auth/forgot-password.ts
var forgot_password_exports = {};
__export(forgot_password_exports, {
  ForgotPassword: () => ForgotPassword
});
module.exports = __toCommonJS(forgot_password_exports);
var import_bcryptjs = __toESM(require("bcryptjs"));

// src/prisma/prisma-client.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query"]
});

// src/schemas/change-password-schema.ts
var import_zod = require("zod");
var ChangeSchema = import_zod.z.object({
  old_password: import_zod.z.string().min(6),
  new_password: import_zod.z.string().min(6)
});

// src/routes/Auth/forgot-password.ts
async function ForgotPassword(app) {
  app.withTypeProvider().patch("/changePassword", {
    schema: {
      body: ChangeSchema,
      summary: "Change password",
      tags: ["Auth"]
    }
  }, async (request, reply) => {
    const { old_password, new_password } = request.body;
    const userId = await request.getCurrentUserId();
    const user = await prisma.user.findFirst({
      where: {
        id: userId
      }
    });
    if (!user) {
      return reply.status(400).send({ message: "Credenciais inv\xE1lidas" });
    }
    const passwordMatch = await import_bcryptjs.default.compare(old_password, user.password);
    if (!passwordMatch) {
      return reply.status(400).send({ message: "Senha antiga inv\xE1lida" });
    }
    const hashedPassword = await import_bcryptjs.default.hash(new_password, 8);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });
    return { message: "Password changed successfully" };
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ForgotPassword
});
