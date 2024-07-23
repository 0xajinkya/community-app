import { Request, Response, NextFunction } from "express";
import { RoleService } from "@services/v1";

/**
 * Controller class for handling role-related operations.
 */
export class RoleController {
  /**
   * Creates a new role.
   */
  static async createRole(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
    try {
      const { name } = req.body;
      const role = await RoleService.createRole(name);
      return res.status(200).json(role);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves all roles with pagination.
   */
  static async getAllRoles(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
    try {
      const page = Number(req.query.page) || 1;
      const result = await RoleService.getAllRoles(page);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
