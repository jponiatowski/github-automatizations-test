import { Octokit } from "@octokit/rest";

const octokit = new Octokit({});

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

  console.log(`Branch: release/${version} CREATED`);

  // Create dev to release branch PR
  const devToReleaseBranch = await octokit.rest.pulls.create({
    owner: "jponiatowski",
    repo: "github-automatizations-test",
    title: `Release branch ${version}`,
    head: "dev",
    base: `release/${version}`,
  });

  if (devToReleaseBranch.status !== 201) {
    throw new Error("Creating pull request failed");
  }
  console.log(`PR: dev -> release/${version} CREATED`);

  // Merge dev to release branch
  const merge = await octokit.rest.pulls.merge({
    owner: "jponiatowski",
    repo: "github-automatizations-test",
    pull_number: devToReleaseBranch.data.number,
  });

  if (merge.status !== 200) {
    throw new Error("Merging pull request failed");
  }
  console.log(`PR: dev -> release/${version} MERGED`);

  // Create release to pre-prod branch PR
  const releaseBranchToPreProd = await octokit.rest.pulls.create({
    owner: "jponiatowski",
    repo: "github-automatizations-test",
    title: `Pre-release ${version}`,
    head: `release/${version}`,
    base: `pre-prod`,
  });

  // Create release to main branch PR
  const releaseBranchToMain = await octokit.rest.pulls.create({
    owner: "jponiatowski",
    repo: "github-automatizations-test",
    title: `Release ${version}`,
    head: `release/${version}`,
    base: "master",
  });

  if (releaseBranchToMain.status !== 201) {
    throw new Error("Creating pull request failed");
  }

  console.log(`PR: release/${version} -> main CREATED`);
}

release();
