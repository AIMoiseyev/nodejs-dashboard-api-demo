import { NextFunction, Response, Request } from 'express';

export interface IMiddlewareInterface {
	execute: (req: Request, res: Response, next: NextFunction) => void;
}
