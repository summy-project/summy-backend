import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

import config from "./config";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 只有不是生产环境的时候才可以使用 swagger。
  if (config.mode !== "prod") {
    const swaggerConfig = new DocumentBuilder()
      .setTitle(`${config.about.name}接口文档`)
      .setDescription(
        "本项目的 Vue/React 前端在部署和允许的时候已经设置反代，因此实际请求路径以 /api 开头。如果诸如 findAll 的查询列表接口是 POST 方法，证明这个接口可以进行模糊查询，具体方法见前端代码。"
      )
      .setVersion(config.about.version)
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup("docs", app, document);
  }

  await app.listen(5202);
}
bootstrap();
