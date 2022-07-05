import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../user.entity';

export const CurrentUser = createParamDecorator(
  (_data: never, context: ExecutionContext): Promise<User> => {
    const request = context.switchToHttp().getRequest();
    return request.currentUser;
  },
);
