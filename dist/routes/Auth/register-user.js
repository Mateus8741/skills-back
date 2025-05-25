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

// src/routes/Auth/register-user.ts
var register_user_exports = {};
__export(register_user_exports, {
  RegisterUser: () => RegisterUser
});
module.exports = __toCommonJS(register_user_exports);
var import_bcryptjs = __toESM(require("bcryptjs"));

// src/prisma/prisma-client.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query"]
});

// src/schemas/register-user-schema.ts
var import_zod = require("zod");
var RegisterSchema = import_zod.z.object({
  firstName: import_zod.z.string().min(2, "Nome muito curto").max(50, "Nome muito longo"),
  lastName: import_zod.z.string().min(2, "Sobrenome muito curto").max(50, "Sobrenome muito longo"),
  email: import_zod.z.string().email("Email inv\xE1lido"),
  phoneNumber: import_zod.z.string(),
  location: import_zod.z.object({
    street: import_zod.z.string().min(2, "Nome da rua muito curto").max(50, "Nome da rua muito longo"),
    neighborhood: import_zod.z.string().min(2, "Nome do bairro muito curto").max(50, "Nome do bairro muito longo"),
    complement: import_zod.z.string().optional(),
    reference: import_zod.z.string().optional(),
    houseNumber: import_zod.z.number().min(1, "N\xFAmero da casa deve ser maior que 0").int()
  }),
  isAuthenticated: import_zod.z.boolean().default(false),
  password: import_zod.z.string().min(6, "Senha muito curta").max(15, "Senha muito longa")
});
var LoginSchema = RegisterSchema.partial();

// src/routes/Auth/register-user.ts
async function RegisterUser(app) {
  app.withTypeProvider().post("/register", {
    schema: {
      body: RegisterSchema,
      summary: "Register a new user",
      tags: ["Auth"]
    }
  }, async (request, reply) => {
    try {
      const { email, firstName, isAuthenticated, lastName, location, phoneNumber, password } = request.body;
      const { houseNumber, neighborhood, street, complement, reference } = location;
      const alreadyExistsSameEmail = await prisma.user.findFirst({
        where: {
          email
        }
      });
      if (alreadyExistsSameEmail) {
        return reply.status(400).send({
          message: "Usu\xE1rio j\xE1 cadastrado"
        });
      }
      const hashedPassword = await import_bcryptjs.default.hash(password, 10);
      await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          isAuthenticated,
          location: {
            create: {
              houseNumber,
              neighborhood,
              street,
              complement: complement || "",
              reference: reference || ""
            }
          },
          phoneNumber,
          password: hashedPassword
        }
      });
      return reply.status(201).send({
        message: "Usu\xE1rio cadastrado com sucesso"
      });
    } catch (error) {
      console.error("Error on register user", error);
      return reply.status(500).send({
        message: "Erro ao cadastrar usu\xE1rio"
      });
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RegisterUser
});
