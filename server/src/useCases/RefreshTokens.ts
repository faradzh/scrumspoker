import refresh from "passport-oauth2-refresh";

import { RequestUser } from "../infrastructure/auth/types";
import { IntegrationRepository } from "../interfaceAdapters/repositories/IntegrationRepository";

class RefreshTokens {
  constructor(private readonly userRepository: any) {
    this.userRepository = userRepository;
  }

  public async execute(
    user: RequestUser
  ): Promise<{ accessToken?: string; refreshToken?: string }> {
    const oldRefreshToken = await this.userRepository.findRefreshToken?.(user);
    try {
      const { accessToken, refreshToken } = await this.requestNewAccessToken(
        oldRefreshToken
      );
      if (accessToken && refreshToken) {
        await this.userRepository.updateTokens(user, accessToken, refreshToken);
      }
      return { accessToken, refreshToken };
    } catch (error) {
      console.error("Error refreshing tokens:", error);
      throw error;
    }
  }

  public async requestNewAccessToken(
    refreshToken: string
  ): Promise<{ accessToken?: string; refreshToken?: string }> {
    return new Promise((resolve, reject) => {
      refresh.requestNewAccessToken(
        "atlassian",
        refreshToken,
        (err, accessToken, refreshToken) => {
          if (err) {
            console.error("Error requesting new access token:", err);
            reject(err);
          } else {
            resolve({ accessToken, refreshToken });
          }
        }
      );
    });
  }
}

export default RefreshTokens;
