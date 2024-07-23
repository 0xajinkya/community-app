import { Router } from "express";
import {
  createCommunityVal,
  currentUser,
  getAllMembersVal,
  isLoggedIn,
  validateRequest,
} from "../../middlewares";
import { CommunityController } from "@controllers/v1";

const router = Router();

router.post(
  "/",
  currentUser,
  isLoggedIn,
  createCommunityVal,
  validateRequest,
  CommunityController.createCommunity
);
router.get("/", CommunityController.getAllCommunities);
router.get(
  "/me/owner",
  currentUser,
  isLoggedIn,
  CommunityController.getMyOwnedCommunities
);
router.get(
  "/:id/members",
  getAllMembersVal,
  validateRequest,
  CommunityController.getAllMembers
);

router.get(
  "/me/member",
  currentUser,
  isLoggedIn,
  CommunityController.getMyJoinedCommunities
);

export { router as communityRouter };
