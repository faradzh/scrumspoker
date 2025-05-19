import refresh from "passport-oauth2-refresh";

import { RequestUser } from "../../infrastructure/auth/types";
import UserModel from "../../infrastructure/database/mongodb/schemas/UserSchema";

class MongoUserRepository {
  public async updateRefreshToken(user: RequestUser, refreshToken: string) {
    await UserModel.findOneAndUpdate(
      { id: user.profile.id },
      { $set: { refreshToken } }
    );
  }

  public async requestNewAccessToken(refreshToken: string) {
    return new Promise((resolve, reject) => {
      refresh.requestNewAccessToken(
        "atlassian",
        refreshToken,
        async (err, accessToken, refreshToken) => {
          if (err) {
            console.error("Refresh failed:", err);
            reject(err);
          }
          resolve({ accessToken, refreshToken });
        }
      );
    });
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
