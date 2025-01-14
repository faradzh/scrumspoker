import { NextFunction, Request, Response } from "express";

export function patchSession(req: Request, _: Response, next: NextFunction) {
    if (req.session && !req.session.regenerate) {
      req.session.regenerate = (cb: CallableFunction) => {
        cb();
      }
    }
  
    if (req.session && !req.session.save) {
      req.session.save = (cb: CallableFunction) => {
        cb();
      }
    }
    next();
  }
  