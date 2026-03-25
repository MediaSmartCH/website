import { execFileSync } from "child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const configPath = resolve(
  root,
  process.env.VERCEL_SETTINGS_FILE || "config/vercel-project-settings.json"
);
const localProjectPath = resolve(root, ".vercel/project.json");
const isDryRun = process.argv.includes("--dry-run");

const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));

const parseJsonOutput = (output) => {
  const jsonStart = output.search(/[\[{]/);

  if (jsonStart === -1) {
    throw new Error(`Unable to locate JSON payload in output:\n${output}`);
  }

  return JSON.parse(output.slice(jsonStart));
};

const getProjectContext = () => {
  const localContext = existsSync(localProjectPath) ? readJson(localProjectPath) : {};

  const projectId = process.env.VERCEL_PROJECT_ID || localContext.projectId;
  const teamId =
    process.env.VERCEL_TEAM_ID ||
    process.env.VERCEL_ORG_ID ||
    localContext.orgId;

  if (!projectId) {
    throw new Error(
      "Missing VERCEL_PROJECT_ID. Set it explicitly in CI or link the project locally with Vercel first."
    );
  }

  return { projectId, teamId };
};

const getApiPath = (projectId, teamId) =>
  `/v9/projects/${projectId}${teamId ? `?teamId=${teamId}` : ""}`;

const requestWithCli = (path, method = "GET", body) => {
  const args = ["api", path, "--raw"];

  if (method !== "GET") {
    args.push("-X", method);
  }

  let tempDir;

  if (body) {
    tempDir = mkdtempSync(join(tmpdir(), "vercel-settings-"));
    const inputPath = join(tempDir, "body.json");
    writeFileSync(inputPath, JSON.stringify(body, null, 2));
    args.push("--input", inputPath);
  }

  try {
    const output = execFileSync("vercel", args, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });

    return parseJsonOutput(output);
  } finally {
    if (tempDir) {
      rmSync(tempDir, { force: true, recursive: true });
    }
  }
};

const requestWithToken = async (path, method = "GET", body) => {
  const response = await fetch(`https://api.vercel.com${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(
      `Vercel API request failed (${response.status} ${response.statusText}): ${JSON.stringify(payload)}`
    );
  }

  return payload;
};

const request = async (path, method = "GET", body) => {
  if (process.env.VERCEL_TOKEN) {
    return requestWithToken(path, method, body);
  }

  return requestWithCli(path, method, body);
};

const pickCurrentSummary = (currentProject, desiredSettings) => {
  const summary = {};

  for (const key of Object.keys(desiredSettings)) {
    if (key === "resourceConfig") {
      summary.resourceConfig = {
        ...currentProject.defaultResourceConfig,
        ...currentProject.resourceConfig,
      };
      continue;
    }

    summary[key] = currentProject[key] ?? null;
  }

  return summary;
};

if (!existsSync(configPath)) {
  throw new Error(`Missing settings file: ${configPath}`);
}

const desiredSettings = readJson(configPath);
const { projectId, teamId } = getProjectContext();
const apiPath = getApiPath(projectId, teamId);
const currentProject = await request(apiPath);
const patch = desiredSettings;

console.log("Current project settings:");
console.log(JSON.stringify(pickCurrentSummary(currentProject, desiredSettings), null, 2));
console.log("");
console.log("Desired patch:");
console.log(JSON.stringify(patch, null, 2));

if (isDryRun) {
  console.log("");
  console.log("Dry run only. No remote changes were applied.");
  process.exit(0);
}

const updatedProject = await request(apiPath, "PATCH", patch);

console.log("");
console.log("Updated project settings:");
console.log(JSON.stringify(pickCurrentSummary(updatedProject, desiredSettings), null, 2));
