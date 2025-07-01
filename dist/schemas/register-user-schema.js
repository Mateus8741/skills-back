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

// src/schemas/register-user-schema.ts
var register_user_schema_exports = {};
__export(register_user_schema_exports, {
  LoginSchema: () => LoginSchema,
  RegisterSchema: () => RegisterSchema
});
module.exports = __toCommonJS(register_user_schema_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LoginSchema,
  RegisterSchema
});
