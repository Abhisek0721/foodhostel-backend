import passport, { AuthenticateOptions } from "passport";
import { Request, Response, NextFunction } from "express";

class Auth {
  //API : /api/v1/auth/google
  //Method : GET
  //Access : Public
  //Description : google authenticate
  googleAuth = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("google", {
      scope: ["profile", "email"],
      accessType: "offline",
      prompt: "consent",
    } as AuthenticateOptions)(req, res, next);
  };

  //API : /api/v1/auth/google/callback
  //Method : GET
  //Access : Public
  //Description : google authentication callback
  googleAuthCallback = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("google", {
      successRedirect: `/api/v1/auth/success`,
      failureRedirect: "/api/v1/auth/failure",
    })(req, res, next);
  };
}

export default new Auth();
