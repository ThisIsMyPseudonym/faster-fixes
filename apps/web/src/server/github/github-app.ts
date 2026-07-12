 import { createAppAuth } from "@octokit/auth-app";
  import { Octokit } from "@octokit/core";

  function getGithubAppConfig() {
    const appId = process.env.GITHUB_APP_ID;
    const privateKey = process.env.GITHUB_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (!appId || !privateKey) {
      throw new Error(
        "GitHub integration is not configured. Set GITHUB_APP_ID and GITHUB_PRIVATE_KEY.",
      );
    }

    return { appId, privateKey };
  }

  export function getAppOctokit() {
    const { appId, privateKey } = getGithubAppConfig();

    return new Octokit({
      authStrategy: createAppAuth,
      auth: { appId, privateKey },
    });
  }

  export function getInstallationOctokit(installationId: number) {
    const { appId, privateKey } = getGithubAppConfig();

    return new Octokit({
      authStrategy: createAppAuth,
      auth: { appId, privateKey, installationId },
    });
  }
