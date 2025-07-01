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

// src/schemas/register-service-schema.ts
var register_service_schema_exports = {};
__export(register_service_schema_exports, {
  Category: () => Category,
  ServiceSchema: () => ServiceSchema
});
module.exports = __toCommonJS(register_service_schema_exports);
var import_zod = require("zod");
var Category = import_zod.z.enum([
  "ELECTRICIAN",
  "PAINTER",
  "BRICKLAYER",
  "GARDENER",
  "PLUMBER",
  "CLEANER",
  "BABYSITTER",
  "OTHERS"
]).default("OTHERS");
var ServiceSchema = import_zod.z.object({
  name: import_zod.z.string().min(2, "Nome muito curto").max(50, "Nome muito longo"),
  description: import_zod.z.string().min(2, "Descri\xE7\xE3o muito curta").max(50, "Descri\xE7\xE3o muito longa"),
  category: Category,
  price: (0, import_zod.number)().positive(),
  location: import_zod.z.object({
    city: import_zod.z.string().min(2, "Nome da cidade muito curto").max(50, "Nome da cidade muito longo"),
    state: import_zod.z.string().length(2, "Estado deve ter 2 caracteres"),
    street: import_zod.z.string().min(2, "Nome da rua muito curto").max(50, "Nome da rua muito longo"),
    neighborhood: import_zod.z.string().min(2, "Nome do bairro muito curto").max(50, "Nome do bairro muito longo"),
    complement: import_zod.z.string().optional().default(""),
    reference: import_zod.z.string().optional().default(""),
    number: (0, import_zod.number)().positive("N\xFAmero deve ser positivo").int().optional().default(0),
    latitude: (0, import_zod.number)().default(0),
    longitude: (0, import_zod.number)().default(0)
  })
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Category,
  ServiceSchema
});
