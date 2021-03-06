import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { User } from '../user.entity';
import { UsersService } from '../users.service';

declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    const { userId } = req.session || {};

    if (userId) {
      //TODO: this portion of file is buggy, rewrite this logic
      try {
        const user = await this.usersService.findOne(userId);
        req.currentUser = user;
      } catch (err) {
        console.error(err);
      }
    }

    next();
  }
}
