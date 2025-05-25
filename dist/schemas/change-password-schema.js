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

// src/schemas/change-password-schema.ts
var change_password_schema_exports = {};
__export(change_password_schema_exports, {
  ChangeSchema: () => ChangeSchema
});
module.exports = __toCommonJS(change_password_schema_exports);
var import_zod = require("zod");
var ChangeSchema = import_zod.z.object({
  old_password: import_zod.z.string().min(6),
  new_password: import_zod.z.string().min(6)
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ChangeSchema
});
