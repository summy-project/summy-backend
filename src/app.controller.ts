import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { NoAuthRequired } from "./common/no-auth.decorator";

@Controller()
@ApiTags("App")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @NoAuthRequired()
  @ApiOperation({ summary: "提示：“后端服务已经启动。”" })
  getHello() {
    return this.appService.getHello();
  }
}
