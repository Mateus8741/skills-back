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

// src/routes/Auth/refresh-token.ts
var refresh_token_exports = {};
__export(refresh_token_exports, {
  RefreshToken: () => RefreshToken
});
module.exports = __toCommonJS(refresh_token_exports);

// src/prisma/prisma-client.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query"]
});

// src/routes/Auth/refresh-token.ts
async function RefreshToken(app) {
  app.withTypeProvider().post(
    "/refresh",
    {
      schema: {
        summary: "Refresh access token",
        tags: ["Auth"]
      }
    },
    async (request, reply) => {
      try {
        await request.jwtVerify({ onlyCookie: true });
        const userId = await request.getCurrentUserId();
        if (!userId) {
          return reply.status(401).send({
            message: "Usu\xE1rio n\xE3o encontrado"
          });
        }
        const token = await reply.jwtSign(
          {
            sign: {
              sub: userId,
              expiresIn: "30d"
            }
          }
        );
        const refreshToken = await reply.jwtSign(
          {
            sign: {
              sub: userId,
              expiresIn: "30d"
            }
          }
        );
        await prisma.user.update({
          where: { id: userId },
          data: { refreshToken }
        });
        return reply.setCookie("refreshToken", refreshToken, {
          path: "/",
          secure: true,
          sameSite: true,
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 30
        }).status(200).send({
          token
        });
      } catch (error) {
        console.error("Error on refresh token:", error);
        return reply.status(401).send({
          message: "Token inv\xE1lido"
        });
      }
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RefreshToken
});
