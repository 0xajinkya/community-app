import { Request, Response, NextFunction } from "express";
import { MemberService } from "@services/v1";

export class MemberController {
  static async addMember(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
    try {
      const { community, role, user } = req.body;
      const result = await MemberService.addMember(community, role, user);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async removeMember(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
    try {
      const userId = req.currentUser!.id;
      const memberId = req.params.id;
      await MemberService.removeMember(userId, memberId);
      return res.status(200).json({ status: true });
    } catch (error) {
      next(error);
    }
  }
}
