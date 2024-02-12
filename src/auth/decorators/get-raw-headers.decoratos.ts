import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const GetRawHeaders = createParamDecorator(
    (_, cxt: ExecutionContext) => {
        return cxt.switchToHttp().getRequest().rawHeaders
    }
)