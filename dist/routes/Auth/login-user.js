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

// src/routes/Auth/login-user.ts
var login_user_exports = {};
__export(login_user_exports, {
  LoginUser: () => LoginUser
});
module.exports = __toCommonJS(login_user_exports);
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

// src/routes/Auth/login-user.ts
async function LoginUser(app) {
  app.withTypeProvider().post(
    "/login",
    {
      schema: {
        body: LoginSchema,
        summary: "Login user",
        tags: ["Auth"]
      }
    },
    async (request, reply) => {
      try {
        const { email, password } = request.body;
        const user = await prisma.user.findFirst({
          where: {
            email
          }
        });
        if (!user) {
          return reply.status(404).send({
            message: "Credenciais inv\xE1lidas"
          });
        }
        const passwordMatch = await import_bcryptjs.default.compare(password, user.password);
        if (!passwordMatch) {
          return reply.status(401).send({
            message: "Credenciais inv\xE1lidas"
          });
        }
        const accessToken = await reply.jwtSign(
          {
            sub: user.id,
            type: "access_token"
          },
          {
            expiresIn: "30d"
          }
        );
        const refreshToken = await reply.jwtSign(
          {
            sub: user.id,
            type: "refresh_token"
          },
          {
            expiresIn: "30d"
          }
        );
        await prisma.user.update({
          where: { id: user.id },
          data: { refreshToken }
        });
        reply.setCookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
          maxAge: 60 * 60 * 24 * 30
        });
        return reply.status(200).send({
          accessToken,
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            isAuthenticated: user.isAuthenticated,
            rating: user.rating
          }
        });
      } catch (error) {
        console.error("Error on login user", error);
        return reply.status(500).send({
          message: "Erro interno"
        });
      }
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LoginUser
});
