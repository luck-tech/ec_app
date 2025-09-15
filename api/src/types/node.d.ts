declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: "development" | "production" | "test";

    readonly AUTH_TOKEN_SECRET: string;
  }
}
