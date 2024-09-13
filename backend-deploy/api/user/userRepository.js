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

// src/api/user/userRepository.ts
var userRepository_exports = {};
__export(userRepository_exports, {
  userRepository: () => userRepository
});
module.exports = __toCommonJS(userRepository_exports);
var import_bcryptjs2 = __toESM(require("bcryptjs"));
var import_crypto = __toESM(require("crypto"));

// src/common/utils/tokenUtils.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));

// src/common/utils/envConfig.ts
var import_dotenv = __toESM(require("dotenv"));
var import_envalid = require("envalid");
import_dotenv.default.config();
var env = (0, import_envalid.cleanEnv)(process.env, {
  NODE_ENV: (0, import_envalid.str)({ devDefault: (0, import_envalid.testOnly)("test"), choices: ["development", "production", "test"] }),
  HOST: (0, import_envalid.host)({ devDefault: (0, import_envalid.testOnly)("localhost") }),
  PORT: (0, import_envalid.port)({ devDefault: (0, import_envalid.testOnly)(3e3) }),
  CORS_ORIGIN: (0, import_envalid.str)({ devDefault: (0, import_envalid.testOnly)("http://localhost:3000") }),
  COMMON_RATE_LIMIT_MAX_REQUESTS: (0, import_envalid.num)({ devDefault: (0, import_envalid.testOnly)(1e3) }),
  COMMON_RATE_LIMIT_WINDOW_MS: (0, import_envalid.num)({ devDefault: (0, import_envalid.testOnly)(1e3) }),
  MONGO_DB_URL: (0, import_envalid.str)({ devDefault: (0, import_envalid.testOnly)("mongodb+srv://kapish:kapish@cluster0.ch85x.mongodb.net/advocatehunt") }),
  JWT_SECRET: (0, import_envalid.str)({ devDefault: (0, import_envalid.testOnly)("$2a$10$rl/7yPMiN0G9vVyyqKrPDOMxXVOJXD2FVY9J4gdtn5JbcmFFK0Bvq") }),
  JWT_TOKEN_Expiry: (0, import_envalid.str)({ devDefault: (0, import_envalid.testOnly)("1d") }),
  JWT_REFRESH_SECRET: (0, import_envalid.str)({
    devDefault: (0, import_envalid.testOnly)("$2a$10$a4m5BrSFBh48Uc8DzL41rOoLMtkNpH1a/kajgkzrw07XRXqaBWlse")
  }),
  REFRESH_TOKEN_Expiry: (0, import_envalid.str)({ devDefault: (0, import_envalid.testOnly)("30d") }),
  RESEND_API_KEY: (0, import_envalid.str)({ devDefault: (0, import_envalid.testOnly)("re_7RaazBDP_9iZhzCtXmhNVCQKasUN5CW1C") })
});

// src/common/utils/tokenUtils.ts
var generateTokens = (user) => {
  const accessToken = import_jsonwebtoken.default.sign({ user }, env.JWT_SECRET, { expiresIn: env.JWT_TOKEN_Expiry });
  const refreshToken = import_jsonwebtoken.default.sign({ user }, env.JWT_REFRESH_SECRET, { expiresIn: env.REFRESH_TOKEN_Expiry });
  return { accessToken, refreshToken };
};

// src/api/user/userSchema.ts
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

// src/api/user/userRepository.ts
var import_resend2 = require("resend");

// src/common/utils/emailService.ts
var import_resend = require("resend");
var resend = new import_resend.Resend(env.RESEND_API_KEY);
var sendEmail = async ({ from, to, subject, html }) => {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html
    });
    if (error) {
      console.error("Error from resend API:", error);
      return { success: false, error };
    }
    console.log("Email sent:", data);
    return { success: true };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { success: false, error: err };
  }
};

// src/api/user/userRepository.ts
var resend2 = new import_resend2.Resend("re_7RaazBDP_9iZhzCtXmhNVCQKasUN5CW1C");
var userRepository = {
  findAllAsync: async () => {
    return UserModel.find().select("-password -__v").exec();
  },
  findByIdAsync: async (id) => {
    return UserModel.findById(id).select("-password -__v").exec();
  },
  createUserAsync: async (newUser) => {
    const hashedPassword = await import_bcryptjs2.default.hash(newUser.password, 10);
    newUser.password = hashedPassword;
    const user = new UserModel(newUser);
    await user.save();
    const { accessToken, refreshToken } = generateTokens(user);
    const userObject = user.toObject();
    userObject.password = "";
    delete userObject.__v;
    return {
      user: userObject,
      accessToken,
      refreshToken
    };
  },
  loginUserAsync: async (credentials) => {
    const { email, password } = credentials;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return null;
    }
    const isPasswordValid = await import_bcryptjs2.default.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }
    const { accessToken, refreshToken } = generateTokens(user);
    return { accessToken, refreshToken };
  },
  resetUserAsync: async (resetUserPayload) => {
    const { email } = resetUserPayload;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return null;
    }
    const resetToken = import_crypto.default.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 15 * 60 * 1e3;
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();
    const emailResult = await sendEmail({
      from: '"Your Company" <onboarding@resend.dev>',
      // Replace with your sender address
      to: [email],
      // Replace with your
      subject: "Password Reset Request",
      html: `<p>You requested a password reset. Use the following token to reset your password:</p><p><strong>${resetToken}</strong></p><p>This token is valid for 15 minutes.</p>`
    });
    console.log("resetToken", resetToken);
    if (emailResult.success) {
      return "Password reset email sent";
    } else {
      return "Error sending password reset email";
    }
  },
  setNewUserPassAsync: async (resetUserPayload) => {
    const { token, newPassword } = resetUserPayload;
    const user = await UserModel.findOne({ resetToken: token });
    if (!user) {
      return null;
    }
    if (user.resetTokenExpiry && user.resetTokenExpiry < Date.now()) {
      return null;
    }
    user.password = newPassword;
    user.resetToken = void 0;
    user.resetTokenExpiry = void 0;
    await user.save();
    return "Password Updated successfully";
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  userRepository
});
//# sourceMappingURL=userRepository.js.map