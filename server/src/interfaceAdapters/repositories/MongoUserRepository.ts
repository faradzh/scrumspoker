import { RequestUser } from "../../infrastructure/auth/types";
import UserModel from "../../infrastructure/database/mongodb/schemas/UserSchema";

class MongoUserRepository {
  public async findOrSaveUser(user: {
    id: string;
    accessToken: string;
    refreshToken: string;
  }) {
    const existingUser = await UserModel.findOneAndUpdate(
      { id: user.id },
      {
        $set: {
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
        },
      }
    );

    if (!existingUser) {
      await UserModel.create({
        id: user.id,
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
      });
    } else {
      return existingUser;
    }
  }

  public async updateTokens(
    user: RequestUser,
    accessToken: string,
    refreshToken: string
  ) {
    await UserModel.findOneAndUpdate(
      { id: user.profile.id },
      { $set: { accessToken, refreshToken } }
    );
  }

  public findRefreshToken(
    user: RequestUser
  ): Promise<string | null | undefined> {
    return UserModel.findOne({ id: user.profile.id })
      .then((user) => {
        if (!user) {
          throw new Error("User not found");
        }
        return user.refreshToken;
      })
      .catch((error) => {
        console.error("Error finding user:", error);
        throw error;
      });
  }
}

export default MongoUserRepository;
