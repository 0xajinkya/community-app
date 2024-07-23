import { Router } from "express";
import { currentUser, currentUserWHeader, signinUserVal, signupUserVal, validateRequest } from "../../middlewares";
import { UserController } from "@controllers/v1";

// import { getMe, signinUser, signoutUser, signupUser } from "../controllers";


const router = Router();

router.post("/signup", signupUserVal, validateRequest, UserController.signupUser);
router.post("/signout", UserController.signoutUser);
router.post("/signin", signinUserVal, validateRequest, UserController.signinUser);
router.get("/me", currentUser, UserController.getMe)
// router.get("/me", currentUserWHeader, UserController.getMe)

export { router as authRouter };
