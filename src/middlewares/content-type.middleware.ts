import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ContentTypeMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const allowedTypes = ['application/json'];
    const contentType = req.headers['content-type'];

    if (!contentType || !allowedTypes.includes(contentType)) {
      throw new BadRequestException(`Content-Type must be one of: ${allowedTypes.join(', ')}`);
    }

    next();
  }
}
