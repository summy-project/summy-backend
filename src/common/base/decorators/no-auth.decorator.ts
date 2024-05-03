import { SetMetadata } from "@nestjs/common";

export interface NoAuthOptions {
  allowNoVisitor?: boolean;
}

export const NoAuthRequired = (options: NoAuthOptions = {}) => {
  return SetMetadata(
    "noAuthRequired",
    options.allowNoVisitor ? "allowNoVisitor" : "allowVisitor"
  );
};
