import { Router } from "express";
import { createRoleVal, validateRequest } from "../../middlewares";
import { RoleController } from "@controllers/v1";


const router = Router();

router.post("/", createRoleVal, validateRequest, RoleController.createRole);
router.get("/", RoleController.getAllRoles)
export { router as roleRouter };