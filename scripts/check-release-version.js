import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const rootDirectory = process.cwd();
const rootPackagePath = path.join(rootDirectory, "package.json");
const rootPackage = readJson(rootPackagePath);
const rootVersion = rootPackage.version;
const errors = [];

if (!rootVersion) {
  errors.push("Root package.json does not define a version.");
}

for (const packagePath of getWorkspacePackagePaths(rootPackage.workspaces ?? [])) {
  const packageJson = readJson(packagePath);

  if (packageJson.version !== rootVersion) {
    errors.push(
      `${path.relative(rootDirectory, packagePath)} has version ${packageJson.version ?? "<missing>"}; expected ${rootVersion}.`,
    );
  }
}

const releaseTag = getReleaseTag();

if (releaseTag) {
  const releaseVersion = releaseTag.startsWith("v") ? releaseTag.slice(1) : releaseTag;

  if (releaseVersion !== rootVersion) {
    errors.push(`GitHub release tag ${releaseTag} does not match root version ${rootVersion}.`);
  }
} else if (process.env.GITHUB_ACTIONS === "true") {
  errors.push("Could not determine the GitHub release tag from GITHUB_REF_NAME or GITHUB_EVENT_PATH.");
} else {
  console.log("Skipping GitHub release tag check outside GitHub Actions.");
}

if (errors.length > 0) {
  console.error("Release version check failed:");

  for (const error of errors) {
    console.error(`- ${error}`);
  }

  process.exit(1);
}

if (releaseTag) {
  console.log(`All workspace packages and GitHub release tag ${releaseTag} match root version ${rootVersion}.`);
} else {
  console.log(`All workspace packages match root version ${rootVersion}.`);
}

function getWorkspacePackagePaths(workspaces) {
  const patterns = Array.isArray(workspaces) ? workspaces : workspaces.packages ?? [];
  const packagePaths = [];

  for (const pattern of patterns) {
    if (!pattern.endsWith("/*")) {
      errors.push(`Unsupported workspace pattern ${pattern}. Expected a trailing /* pattern.`);
      continue;
    }

    const workspaceDirectory = path.join(rootDirectory, pattern.slice(0, -2));

    for (const entry of fs.readdirSync(workspaceDirectory, { withFileTypes: true })) {
      if (!entry.isDirectory()) {
        continue;
      }

      const packagePath = path.join(workspaceDirectory, entry.name, "package.json");

      if (fs.existsSync(packagePath)) {
        packagePaths.push(packagePath);
      }
    }
  }

  return packagePaths.sort();
}

function getReleaseTag() {
  if (process.env.GITHUB_REF_NAME) {
    return process.env.GITHUB_REF_NAME;
  }

  if (!process.env.GITHUB_EVENT_PATH) {
    return undefined;
  }

  const event = readJson(process.env.GITHUB_EVENT_PATH);

  return event.release?.tag_name;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}
