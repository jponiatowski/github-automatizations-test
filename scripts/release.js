import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: "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",
});

const versionRegex = new RegExp(/^\d+\.\d+\.\d+$/);

async function release() {
  const version = process.argv?.[2];

  if (!version) {
    throw new Error("No version provided");
  }

  if (!versionRegex.test(version)) {
    throw new Error("Invalid version format");
  }

  // Get master branch sha
  const masterBranch = await octokit.rest.repos.getBranch({
    owner: "jponiatowski",
    repo: "github-automatizations-test",
    branch: "master",
  });

  const sha = masterBranch?.data?.commit?.sha;

  if (!sha) {
    throw new Error("No sha found for master branch");
  }

  // Create release branch
  const releaseBranch = await octokit.rest.git.createRef({
    owner: "jponiatowski",
    repo: "github-automatizations-test",
    ref: `refs/heads/release/${version}`,
    sha,
  });

  if (releaseBranch.status !== 201) {
    throw new Error("Creating release branch failed");
  }

  console.log("Release branch created");

  // Create dev to release branch PR
  const pullRequest = await octokit.rest.pulls.create({
    owner: "jponiatowski",
    repo: "github-automatizations-test",
    title: `Release branch ${version}`,
    head: "dev",
    base: `release/${version}`,
  });

  if (pullRequest.status !== 201) {
    throw new Error("Creating pull request failed");
  }

  console.log("Pull request created created");
}

release();
