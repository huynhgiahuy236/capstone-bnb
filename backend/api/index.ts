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
  );
  await configureApp(app);
  await app.init();
  isAppReady = true;
}

export default async function handler(req: Request, res: Response) {
  if (!isAppReady) {
    await bootstrapServerless(server);
  }
  return server(req, res);
}
