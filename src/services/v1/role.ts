import { Role } from "@schema/v1";
import { Snowflake } from "@theinternetfolks/snowflake";

/**
 * Service class for role-related operations.
 */
export class RoleService {
  /**
   * Creates a new role.
   * @param name - The name of the role to create.
   * @returns A JSON object containing the created role details.
   */
  static async createRole(name: string) {
    const role = await Role.create({
      id: Snowflake.generate(),
      name,
    });

    return {
      status: true,
      content: {
        data: {
          id: role.id,
          name: role.name,
          created_at: role.createdAt,
          updated_at: role.updatedAt,
        },
      },
    };
  }

  /**
   * Retrieves all roles with pagination.
   * @param page - The page number for pagination.
   * @returns A JSON object containing the roles and pagination metadata.
   */
  static async getAllRoles(page: number) {
    const roles = await Role.findAll({
      limit: 10,
      offset: page <= 1 ? 0 : (page - 1) * 10,
    });

    const total = await Role.count();

    return {
      status: true,
      content: {
        meta: {
          total: total,
          pages: Math.ceil(total / 10),
          page: page <= 1 ? 1 : page,
        },
        data: roles,
      },
    };
  }
}
