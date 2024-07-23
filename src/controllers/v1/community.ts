import { Request, Response, NextFunction } from "express";
import { ParametricError } from "../../errors";
import { CommunityService } from "@services/v1";

export class CommunityController {
  static async createCommunity(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id: userId } = req.currentUser!;
      const { name } = req.body;
      const community = await CommunityService.createCommunity(userId, name);

      return res.status(200).json({
        status: true,
        content: {
          data: {
            id: community.id,
            name: community.name,
            slug: community.slug,
            owner: community.ownerId,
            created_at: community.createdAt,
            updated_at: community.updatedAt,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllCommunities(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      let page = Number(req.query.page);
      if (!page) {
        page = 1;
      }
      const { communities, meta } = await CommunityService.getAllCommunities(
        page
      );

      return res.status(200).json({
        status: true,
        content: {
          meta,
          data: communities,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMyOwnedCommunities(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id: userId } = req.currentUser!;
      let page = Number(req.query.page);
      if (!page) {
        page = 1;
      }
      const { myCommunities, meta } =
        await CommunityService.getMyOwnedCommunities(userId, page);

      return res.status(200).json({
        status: true,
        content: {
          meta,
          data: myCommunities,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMyJoinedCommunities(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      let page = Number(req.query.page);
      if (!page) {
        page = 1;
      }
      const { id: userId } = req.currentUser!;
      const { communitiesWithOwners, meta } =
        await CommunityService.getMyJoinedCommunities(userId, page);

      return res.status(200).json({
        status: true,
        content: {
          meta,
          data: communitiesWithOwners,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllMembers(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      let page = Number(req.query.page);
      if (!page) {
        page = 1;
      }
      const { membersExtended, meta } = await CommunityService.getAllMembers(
        id,
        page
      );

      return res.status(200).json({
        status: true,
        content: {
          meta,
          data: membersExtended,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
