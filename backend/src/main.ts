import * as dotenv from "dotenv";
dotenv.config();

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import * as fs from "fs";

export async function configureApp(app: NestExpressApplication) {
  // Parse Cookie
  app.use(cookieParser());

  // Enable CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Serve static files (public/images) if directory exists
  const publicPath = join(process.cwd(), "public");
  if (fs.existsSync(publicPath)) {
    app.useStaticAssets(publicPath, {
      prefix: "/public/",
    });
  }

  // Global Prefix
  app.setGlobalPrefix("api");

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Setup Swagger UI
  const config = new DocumentBuilder()
    .setTitle("Airbnb API - CyberSoft Capstone")
    .setDescription(
      "Tài liệu đặc tả API dự án cuối khóa Airbnb chuẩn CyberSoft",
    )
    .setVersion("1.0.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "Authorization",
        description: "Nhập Bearer Token",
        in: "header",
      },
      "Bearer",
    )
    .addApiKey(
      {
        type: "apiKey",
        name: "token",
        in: "header",
        description: "Nhập token qua header token",
      },
      "token",
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const swaggerUiOptions = {
    customCssUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css",
    customJs: [
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.js",
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.js",
    ],
    customSiteTitle: "Airbnb API Docs - CyberSoft Capstone",
    swaggerOptions: {
      persistAuthorization: true,
    },
  };

  // Setup on both /swagger and /api/docs for maximum compatibility
  SwaggerModule.setup("swagger", app, document, swaggerUiOptions);
  SwaggerModule.setup("api/docs", app, document, swaggerUiOptions);
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  await configureApp(app);

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
  console.log(`📑 Swagger UI đang mở tại: http://localhost:${PORT}/swagger`);
  console.log(`📑 Swagger UI (docs): http://localhost:${PORT}/api/docs`);
}

if (!process.env.VERCEL) {
  bootstrap();
}
