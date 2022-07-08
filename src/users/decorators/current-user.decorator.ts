import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (_data: never, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    return req.currentUser;
  },
);
