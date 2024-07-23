import { User } from "@schema/v1";
import { Snowflake } from "@theinternetfolks/snowflake";
import { UserPayloadForJwt } from "@interfaces/v1";
import { NonParametricError, ParametricError } from "errors";
import { comparePasswords, encryptSession } from "@universe/v1";


export class UserService {
  static async signupUser(name: string, email: string, password: string) {
    const id = Snowflake.generate();
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      throw new ParametricError([
        {
          param: "email",
          message: "User with this email address already exists.",
          code: "RESOURCE_EXISTS",
        },
      ]);
    }

    const user = await User.create({ id, name, email, password });
    const payload: UserPayloadForJwt = { id: user.id };
    const encSession = encryptSession(payload);

    return {
      status: true,
      content: {
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          created_at: user.createdAt,
        },
        meta: {
          access_token: encSession,
        },
      },
    };
  }

  static async signoutUser(req: any) {
    if (!req.session?.isPopulated) {
      throw new NonParametricError([
        { message: "You need to sign in to proceed.", code: "NOT_SIGNEDIN" },
      ]);
    }
    req.session = null;
  }

  static async signinUser(email: string, password: string) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new ParametricError([
        {
          param: "user",
          message: "User not found.",
          code: "RESOURCE_NOT_FOUND",
        },
      ]);
    }

    const isMatched = await comparePasswords(password, user.password);
    if (!isMatched) {
      throw new ParametricError([
        {
          param: "password",
          message: "The credentials you provided are invalid.",
          code: "INVALID_CREDENTIALS",
        },
      ]);
    }

    const payload: UserPayloadForJwt = { id: String(user.id) };
    const encSession = encryptSession(payload);

    return {
      status: true,
      content: {
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          created_at: user.createdAt,
        },
        meta: {
          access_token: encSession,
        },
      },
    };
  }

  static async getMe(req: any) {
    if (!req.currentUser?.id) {
      throw new NonParametricError([
        { message: "You need to sign in to proceed.", code: "NOT_SIGNEDIN" },
      ]);
    }

    const user = await User.findOne({ where: { id: req.currentUser.id } });

    if (!user) {
      throw new ParametricError([
        {
          param: "user",
          message: "User not found.",
          code: "RESOURCE_NOT_FOUND",
        },
      ]);
    }

    return {
      status: true,
      content: {
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          created_at: user.createdAt,
        },
      },
    };
  }
}
