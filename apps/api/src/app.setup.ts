import type { INestApplication } from "@nestjs/common";
import type { Request, Response, NextFunction } from "express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { APP_CONFIG } from "./config/app-config.module.js";
import type { AppConfig } from "./config/app-config.js";
import { requestIdMiddleware } from "./modules/content-common/request-id.middleware.js";

export const API_PREFIX = "api/v1";
export const OPENAPI_JSON_PATH = `${API_PREFIX}/openapi.json`;
export const SWAGGER_UI_PATH = `${API_PREFIX}/docs`;

export function configureApp(app: INestApplication): void {
  const config = app.get<AppConfig>(APP_CONFIG);

  app.setGlobalPrefix(API_PREFIX);

  app.enableCors({
    origin: config.corsOrigins,
    methods: ["GET", "HEAD", "OPTIONS", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "X-Request-Id", "X-CSRF-Token"],
    credentials: true,
    maxAge: 3600,
  });

  app.use((_request: Request, response: Response, next: NextFunction) => {
    response.removeHeader("X-Powered-By");
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("X-Frame-Options", "DENY");
    response.setHeader("Referrer-Policy", "no-referrer");
    next();
  });
  app.use(requestIdMiddleware);
  app.use((request: Request, response: Response, next: NextFunction) => {
    if (/^\/api\/v1\/(auth|me|admin)(?:\/|$)/.test(request.path)) response.setHeader("Cache-Control", "no-store");
    next();
  });

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle("Tourism API")
      .setDescription(
        "Public content API cho website du lịch vùng sâu, vùng xa. Các endpoint public không yêu cầu đăng nhập; không có endpoint ghi nội dung trong P3.",
      )
      .setVersion("1.0.0")
      .addCookieAuth("wd_access", { type: "apiKey", in: "cookie" }, "sessionAuth")
      .setOpenAPIVersion("3.1.0")
      .build(),
  );

  SwaggerModule.setup(SWAGGER_UI_PATH, app, document, {
    jsonDocumentUrl: `/${OPENAPI_JSON_PATH}`,
  });
}
