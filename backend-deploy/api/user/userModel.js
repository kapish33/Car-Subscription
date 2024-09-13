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

// src/api/user/userModel.ts
var userModel_exports = {};
__export(userModel_exports, {
  CreateUserSchema: () => CreateUserSchema,
  GetUserSchema: () => GetUserSchema,
  LoginPayload: () => LoginPayload,
  ResetNewPasswordPayload: () => ResetNewPasswordPayload,
  ResetPasswordPayload: () => ResetPasswordPayload,
  ResponseString: () => ResponseString,
  TokensSchema: () => TokensSchema,
  UserSchema: () => UserSchema,
  UserWithTokensSchema: () => UserWithTokensSchema
});
module.exports = __toCommonJS(userModel_exports);
var import_zod_to_openapi = require("@asteasolutions/zod-to-openapi");
var import_zod2 = require("zod");

// src/common/utils/commonValidation.ts
var import_zod = require("zod");
var commonValidations = {
  id: import_zod.z.string().refine((data) => typeof data === "string", {
    message: "ID must be a string value"
  })
  // ... other common validations
};

// src/api/user/userModel.ts
(0, import_zod_to_openapi.extendZodWithOpenApi)(import_zod2.z);
var UserSchema = import_zod2.z.object({
  _id: import_zod2.z.string().uuid(),
  firstName: import_zod2.z.string(),
  email: import_zod2.z.string().email(),
  lastName: import_zod2.z.string(),
  age: import_zod2.z.number(),
  password: import_zod2.z.string(),
  resetToken: import_zod2.z.string().optional(),
  resetTokenExpiry: import_zod2.z.number().optional()
  // createdAt: z.date(),
  // updatedAt: z.date(),
});
var TokensSchema = import_zod2.z.object({
  accessToken: import_zod2.z.string(),
  refreshToken: import_zod2.z.string()
});
var UserWithTokensSchema = import_zod2.z.object({
  user: UserSchema,
  ...TokensSchema.shape
});
var GetUserSchema = import_zod2.z.object({
  params: import_zod2.z.object({ id: commonValidations.id })
});
var CreateUserSchema = import_zod2.z.object({
  body: import_zod2.z.object({
    firstName: import_zod2.z.string(),
    lastName: import_zod2.z.string(),
    age: import_zod2.z.number(),
    password: import_zod2.z.string(),
    email: import_zod2.z.string().email()
  })
});
var LoginPayload = import_zod2.z.object({
  body: import_zod2.z.object({
    email: import_zod2.z.string().email(),
    password: import_zod2.z.string()
  })
});
var ResetPasswordPayload = import_zod2.z.object({
  body: import_zod2.z.object({
    email: import_zod2.z.string().email()
  })
});
var ResetNewPasswordPayload = import_zod2.z.object({
  body: import_zod2.z.object({
    token: import_zod2.z.string(),
    newPassword: import_zod2.z.string()
  })
});
var ResponseString = import_zod2.z.object({
  responseObject: import_zod2.z.string()
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CreateUserSchema,
  GetUserSchema,
  LoginPayload,
  ResetNewPasswordPayload,
  ResetPasswordPayload,
  ResponseString,
  TokensSchema,
  UserSchema,
  UserWithTokensSchema
});
//# sourceMappingURL=userModel.js.map