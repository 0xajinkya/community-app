
import { Snowflake } from "@theinternetfolks/snowflake";
import { Op } from "@sequelize/core";
import { Member, Role, User } from "@schema/v1";
import { NonParametricError, ParametricError } from "errors";

/**
 * Service class for member-related operations.
 */
export class MemberService {
  static async addMember(community: string, role: string, user: string) {
    const roleDoc = await Role.findByPk(role);
    if (!roleDoc) {
      throw new ParametricError([
        {
          param: "role",
          message: "Role not found.",
          code: "RESOURCE_NOT_FOUND",
        },
      ]);
    }

    const userDoc = await User.findByPk(user);
    if (!userDoc) {
      throw new ParametricError([
        {
          param: "user",
          message: "User not found.",
          code: "RESOURCE_NOT_FOUND",
        },
      ]);
    }

    let existingMember = await Member.findOne({
      where: {
        userId: user,
        communityId: community,
        roleId: role,
      },
    });

    if (existingMember) {
      throw new NonParametricError([
        {
          message: "User is already added in the community.",
          code: "RESOURCE_EXISTS",
        },
      ]);
    }

    const newMember = await Member.create({
      id: Snowflake.generate(),
      userId: user,
      communityId: community,
      roleId: role,
    });

    return {
      status: true,
      content: {
        data: {
          id: newMember.id,
          community: newMember.communityId,
          user: newMember.userId,
          role: newMember.roleId,
          created_at: newMember.createdAt,
        },
      },
    };
  }

  static async removeMember(userId: string, memberId: string) {
    const roles = await Role.findAll({
      where: {
        [Op.or]: [{ name: "Community Admin" }, { name: "Community Moderator" }],
      },
    });

    const communities = await Member.findAll({
      where: {
        userId: userId,
        roleId: {
          [Op.in]: roles.map((role) => role.id),
        },
      },
    });

    const membersToRemove = await Member.findAll({
      where: {
        userId: memberId,
        communityId: {
          [Op.in]: communities.map((community) => community.communityId),
        },
      },
    });

    if (membersToRemove.length === 0) {
      throw new NonParametricError([
        {
          message: "Member not found.",
          code: "RESOURCE_NOT_FOUND",
        },
      ]);
    }

    await Promise.all(membersToRemove.map((member) => member.destroy()));
  }
}
