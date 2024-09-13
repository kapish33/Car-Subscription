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

// src/api/user/userSchema.ts
var userSchema_exports = {};
__export(userSchema_exports, {
  UserModel: () => UserModel
});
module.exports = __toCommonJS(userSchema_exports);
var import_mongoose = __toESM(require("mongoose"));
var import_bcryptjs = __toESM(require("bcryptjs"));
var UserSchema = new import_mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    resetToken: { type: String, required: false },
    resetTokenExpiry: { type: Number, required: false }
  },
  {
    versionKey: false,
    timestamp: true
  }
);
UserSchema.pre("save", async function(next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await import_bcryptjs.default.genSalt(10);
    this.password = await import_bcryptjs.default.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return import_bcryptjs.default.compare(candidatePassword, this.password);
};
var UserModel = import_mongoose.default.model("User", UserSchema);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UserModel
});
//# sourceMappingURL=userSchema.js.map