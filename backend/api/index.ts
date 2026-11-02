import "reflect-metadata";
import * as dotenv from "dotenv";
dotenv.config();

import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/app.module";
import { ExpressAdapter, NestExpressApplication } from "@nestjs/platform-express";
import express, { Express, Request, Response } from "express";
import { configureApp } from "../src/main";

const server: Express = express();
let isAppReady = false;

async function bootstrapServerless(expressInstance: Express): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(expressInstance),
    { logger: ["error", "warn", "log"] },
  );
  await configureApp(app);
  await app.init();
  isAppReady = true;
}

export default async function handler(req: Request, res: Response) {
  try {
    if (!isAppReady) {
      await bootstrapServerless(server);
    }
    return server(req, res);
  } catch (error: any) {
    console.error("Vercel Serverless Bootstrap Error:", error);
    return res.status(500).json({
      statusCode: 500,
      message: "Vercel Serverless Bootstrap Error",
      error: error?.message || String(error),
      stack: error?.stack,
    });
  }
}
