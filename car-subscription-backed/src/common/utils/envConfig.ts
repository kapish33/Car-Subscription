import dotenv from 'dotenv';
import { cleanEnv, host, num, port, str, testOnly } from 'envalid';

dotenv.config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ devDefault: testOnly('test'), choices: ['development', 'production', 'test'] }),
  HOST: host({ devDefault: testOnly('localhost') }),
  PORT: port({ devDefault: testOnly(3000) }),
  CORS_ORIGIN: str({ devDefault: testOnly('http://localhost:5173') }),
  COMMON_RATE_LIMIT_MAX_REQUESTS: num({ devDefault: testOnly(20000) }),
  COMMON_RATE_LIMIT_WINDOW_MS: num({ devDefault: testOnly(1000) }),
  MONGO_DB_URL: str({ devDefault: testOnly('mongodb+srv://kapish:kapish@cluster0.ch85x.mongodb.net/advocatehunt') }),
  JWT_SECRET: str({ devDefault: testOnly('$2a$10$rl/7yPMiN0G9vVyyqKrPDOMxXVOJXD2FVY9J4gdtn5JbcmFFK0Bvq') }),
  JWT_TOKEN_Expiry: str({ devDefault: testOnly('1d') }),
  JWT_REFRESH_SECRET: str({
    devDefault: testOnly('$2a$10$a4m5BrSFBh48Uc8DzL41rOoLMtkNpH1a/kajgkzrw07XRXqaBWlse'),
  }),
  REFRESH_TOKEN_Expiry: str({ devDefault: testOnly('30d') }),
  RESEND_API_KEY: str({ devDefault: testOnly('re_7RaazBDP_9iZhzCtXmhNVCQKasUN5CW1C') })
});
