import { Snowflake } from "@theinternetfolks/snowflake";
import { Op } from "@sequelize/core";
import { ParametricError } from "errors";
import { Community, Member, Role, User } from "@schema/v1";

export class CommunityService {
  static async createCommunity(userId: string, name: string) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new ParametricError([
        {
          param: "user",
          message: "User not found.",
          code: "RESOURCE_NOT_FOUND",
        },
      ]);
    }
    const id = Snowflake.generate();
    const community = await Community.create({
      name,
      id,
      slug: name.toLowerCase().replace(/[\s\W-]+/g, "-"),
      ownerId: userId,
    });

    let role = await Role.findOne({
      where: {
        name: "Community Admin",
      },
    });

    if (!role) {
      role = await Role.create({
        name: "Community Admin",
        id: Snowflake.generate(),
      });
    }

    await Member.create({
      id: Snowflake.generate(),
      communityId: community.id,
      userId: userId,
      roleId: role.id,
    });

    return community;
  }

  static async getAllCommunities(page: number) {
    const communities = await Community.findAll({
      limit: 10,
      offset: page <= 1 ? 0 : (page - 1) * 10,
    });

    const total = await Community.count();
    return {
      communities,
      meta: {
        total,
        pages: Math.ceil(total / 10),
        page: page <= 1 ? 1 : page,
      },
    };
  }

  static async getMyOwnedCommunities(userId: string, page: number) {
    const total = await Community.count({ where: { ownerId: userId } });
    const myCommunities = await Community.findAll({
      where: {
        ownerId: userId,
      },
      limit: 10,
      offset: page <= 1 ? 0 : (page - 1) * 10,
    });

    return {
      myCommunities,
      meta: {
        total,
        pages: Math.ceil(total / 10),
        page: page <= 1 ? 1 : page,
      },
    };
  }

  static async getMyJoinedCommunities(userId: string, page: number) {
    const memberRole = await Role.findAll({
      where: {
        name: {
          [Op.in]: ["Community Member", "Community Moderator"],
        },
      },
    });

    if (memberRole.length === 0) {
      throw new ParametricError([
        {
          param: "role",
          message: "Community Member role not found.",
          code: "RESOURCE_NOT_FOUND",
        },
        {
          param: "role",
          message: "Community Admin role not found.",
          code: "RESOURCE_NOT_FOUND",
        },
      ]);
    }

    const roleIds = memberRole.map((role) => role.id);
    const memberships = await Member.findAll({
      where: {
        userId,
        roleId: {
          [Op.in]: roleIds,
        },
      },
      limit: 10,
      offset: page <= 1 ? 0 : (page - 1) * 10,
    });

    const totalMemberships = await Member.count({
      where: {
        userId,
        roleId: {
          [Op.in]: roleIds,
        },
      },
    });

    const communitiesWithOwners = await Promise.all(
      memberships.map(async (membership) => {
        const community = await membership.getCommunity();
        const owner = await community!.getOwner();

        return {
          id: community!.id,
          name: community!.name,
          slug: community!.slug,
          owner: owner
            ? {
                id: owner.id,
                name: owner.name,
              }
            : null,
          created_at: community!.createdAt,
          updated_at: community!.updatedAt,
        };
      })
    );

    return {
      communitiesWithOwners,
      meta: {
        total: totalMemberships,
        pages: Math.ceil(totalMemberships / 10),
        page: page <= 1 ? 1 : page,
      },
    };
  }

  static async getAllMembers(communityId: string, page: number) {
    const members = await Member.findAll({
      where: {
        communityId,
      },
      limit: 10,
      offset: page <= 1 ? 0 : (page - 1) * 10,
    });

    const totalMembers = await Member.count({
      where: {
        communityId,
      },
    });

    const membersExtended = await Promise.all(
      members.map(async (member) => {
        const role = await member.getRole();
        const user = await member.getUser();

        return {
          id: member.id,
          community: member.communityId,
          user: {
            id: user!.id,
            name: user!.name,
          },
          role: {
            id: role!.id,
            name: role!.name,
          },
        };
      })
    );

    return {
      membersExtended,
      meta: {
        total: totalMembers,
        pages: Math.ceil(totalMembers / 10),
        page: page <= 1 ? 1 : page,
      },
    };
  }
}