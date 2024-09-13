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

// src/common/middleware/requestCookieValidation.ts
var requestCookieValidation_exports = {};
__export(requestCookieValidation_exports, {
  requestCookieValidation: () => requestCookieValidation
});
module.exports = __toCommonJS(requestCookieValidation_exports);
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"));
var import_http_status_codes = require("http-status-codes");

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
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var generateTokens = (user) => {
  const accessToken = import_jsonwebtoken.default.sign({ user }, env.JWT_SECRET, { expiresIn: env.JWT_TOKEN_Expiry });
  const refreshToken = import_jsonwebtoken.default.sign({ user }, env.JWT_REFRESH_SECRET, { expiresIn: env.REFRESH_TOKEN_Expiry });
  return { accessToken, refreshToken };
};

// src/common/middleware/requestCookieValidation.ts
var requestCookieValidation = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;
  if (!accessToken && !refreshToken) {
    return res.status(import_http_status_codes.StatusCodes.UNAUTHORIZED).json({ valid: false, message: "No tokens provided" });
  }
  try {
    const { user } = import_jsonwebtoken2.default.verify(refreshToken, env.JWT_REFRESH_SECRET);
    req.user = user;
    return next();
  } catch (err) {
    if (!refreshToken) {
      return res.status(import_http_status_codes.StatusCodes.UNAUTHORIZED).json({ valid: false, message: "Invalid access token and no refresh token provided" });
    }
    try {
      const { user } = import_jsonwebtoken2.default.verify(refreshToken, env.JWT_REFRESH_SECRET);
      const { accessToken: accessToken2, refreshToken: rft } = generateTokens(user);
      console.log("refetch Token", accessToken2, rft);
      res.cookie("accessToken", accessToken2, {
        httpOnly: true,
        sameSite: "strict"
      });
      res.cookie("refreshToken", rft, {
        httpOnly: true,
        sameSite: "strict"
      });
      req.user = user;
      return next();
    } catch (err2) {
      return res.status(import_http_status_codes.StatusCodes.UNAUTHORIZED).json({ valid: false, message: "Invalid refresh token" });
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  requestCookieValidation
});
//# sourceMappingURL=requestCookieValidation.js.map