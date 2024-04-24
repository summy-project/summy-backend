import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHello() {
    return "后端服务已经启动。";
  }
}
