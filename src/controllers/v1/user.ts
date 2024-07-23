import { UserService } from "@services/v1";
import { Request, Response, NextFunction } from "express";

export class UserController {
  static async signupUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | undefined> {
    try {
      const { name, email, password } = req.body;
      const result = await UserService.signupUser(name, email, password);
      req.session = { jwt: result.content.meta.access_token };
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async signoutUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | undefined> {
    try {
      await UserService.signoutUser(req);
      return res
        .status(200)
        .json({ status: true, content: { message: "Logged out!" } });
    } catch (error) {
      next(error);
    }
  }

  static async signinUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | undefined> {
    try {
      const { email, password } = req.body;
      const result = await UserService.signinUser(email, password);
      req.session = { jwt: result.content.meta.access_token };
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getMe(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | undefined> {
    try {
      const user = await UserService.getMe(req);
      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
}
