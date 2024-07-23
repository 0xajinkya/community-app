import { Router } from "express";
import {
  addMemberVal,
  currentUser,
  deleteMemberVal,
  isCommunityAdmin,
  isCommunityModerator,
  isLoggedIn,
  validateRequest,
} from "../../middlewares";
import { MemberController } from "@controllers/v1";

const router = Router();

router.post(
  "/",
  addMemberVal,
  validateRequest,
  currentUser,
  isLoggedIn,
  isCommunityAdmin,
  MemberController.addMember
);
router.delete(
  "/:id",
  deleteMemberVal,
  validateRequest,
  currentUser,
  isLoggedIn,
  isCommunityModerator,
  MemberController.removeMember
);
export { router as memberRouter };
