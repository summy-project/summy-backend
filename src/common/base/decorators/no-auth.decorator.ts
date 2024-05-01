import { SetMetadata } from "@nestjs/common";

export interface NoAuthOptions {
  allowNoVisitor?: boolean;
}

export const NoAuthRequired = (options: NoAuthOptions = {}) => {
  const metadataKey = options.allowNoVisitor
    ? "noAuthAndNoVisitorRequired"
    : "noAuthRequired";
  return SetMetadata(metadataKey, true);
};
