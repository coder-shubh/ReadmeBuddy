"use client";
import type { enhanceDescription } from "@/ai/flows/enhance-description";

type AssembleReadmeParams = {
  name: string;
  fileList: string[];
  getFileContentFn: (path: string) => Promise<string | null>;
  initialDescription: string;
  repoUrl?: string;
  ai: {
    enhanceDescription: typeof enhanceDescription;
  };
};

const techIcons: Record<string, string> = {
  Python: "🐍",
  "Node.js": "⬢",
  React: "⚛️",
  "React Native": "📱",
  "Express.js": "🚀",
  Docker: "🐳",
  "Java (Maven)": "☕",
  Make: "🔨",
  Rust: "🦀",
  Go: "🐹",
  Ruby: "💎",
  PHP: "🐘",
  "C++": "➕➕",
  "C#": "♯",
  TypeScript: "📜",
  "Vue.js": "🖖",
  Angular: "🅰️",
  Svelte: "✨",
  Flask: "🍶",
  Django: "🎸",
  "Next.js": "next.js",
  ".NET": "🔷",
  Flutter: "💙",
  "Android (Native)": "🤖",
  "iOS (Native)": "🍎",
};

const featureEmojis: Record<string, string> = {
  api: "🌐",
  database: "🗄️",
  auth: "🔐",
  testing: "🧪",
  cli: "💻",
  web: "🕸️",
  mobile: "📱",
  desktop: "🖥️",
  ai: "🧠",
  ml: "🤖",
  blockchain: "⛓️",
  game: "🎮",
  iot: "📶",
  cloud: "☁️",
  microservice: "🧩",
  monolith: "🏛️",
};

async function detectStackAndDependencies(
  fileList: string[],
  getFileContentFn: (path: string) => Promise<string | null>
): Promise<{ tech: string[]; deps: Record<string, string> }> {
  const tech = new Set<string>();
  let deps: Record<string, string> = {};

  // Helper to parse Python version specifiers in requirements.txt
  const parsePythonVersion = (
    line: string
  ): { name: string; version: string } => {
    const match = line.match(/^([a-zA-Z0-9_-]+)(?:(==|>=|<=|~=|>|<)(.*))?$/);
    if (!match) return { name: line.trim(), version: "latest" };
    const [, name, , version = "latest"] = match;
    return { name: name.trim(), version: version.trim() || "latest" };
  };

  // Node.js (package.json) - Prioritize this for JS ecosystem
  const rootPackageJsonPath = fileList.find((f) => f === "package.json");
  const packageJsonPath =
    rootPackageJsonPath || fileList.find((f) => f.endsWith("package.json"));

  if (packageJsonPath) {
    const content = await getFileContentFn(packageJsonPath);
    if (content) {
      try {
        const pkg = JSON.parse(content);
        const productionDeps = pkg.dependencies || {};
        deps = productionDeps;

        let hasSpecificFramework = false;

        if (productionDeps["react-native"]) {
          tech.add("React Native");
          hasSpecificFramework = true;
        }
        if (productionDeps["next"]) {
          tech.add("Next.js");
          hasSpecificFramework = true;
        }
        if (productionDeps["react"]) {
          tech.add("React");
          hasSpecificFramework = true;
        }
        if (productionDeps["express"]) {
          tech.add("Express.js");
          hasSpecificFramework = true;
        }
        if (
          pkg.dependencies?.["typescript"] ||
          pkg.devDependencies?.["typescript"]
        ) {
          tech.add("TypeScript");
        }
        if (productionDeps["vue"]) {
          tech.add("Vue.js");
          hasSpecificFramework = true;
        }
        if (productionDeps["@angular/core"]) {
          tech.add("Angular");
          hasSpecificFramework = true;
        }
        if (productionDeps["svelte"]) {
          tech.add("Svelte");
          hasSpecificFramework = true;
        }
        // Add Node.js as a base if there are dependencies but no specific frontend framework detected
        if (!hasSpecificFramework && Object.keys(productionDeps).length > 0) {
          tech.add("Node.js");
        }
        if (productionDeps["flask"]) tech.add("Flask");
        if (productionDeps["django"]) tech.add("Django");
      } catch (e) {
        console.warn(`Failed to parse package.json at ${packageJsonPath}:`, e);
      }
    }
    // If we found a package.json, we assume it's a JS project and return immediately.
    return { tech: Array.from(tech).sort(), deps };
  }

  // Fallback to other file types if package.json is not found

  // Python (requirements.txt)
  const requirementsTxtPath = fileList.find((f) =>
    f.endsWith("requirements.txt")
  );
  if (requirementsTxtPath) {
    tech.add("Python");
    const content = await getFileContentFn(requirementsTxtPath);
    if (content) {
      try {
        content.split("\n").forEach((line) => {
          line = line.trim();
          if (line && !line.startsWith("#")) {
            const { name, version } = parsePythonVersion(line);
            if (name) deps[name] = version;
          }
        });
      } catch (e) {
        console.warn(
          `Failed to parse requirements.txt at ${requirementsTxtPath}:`,
          e
        );
      }
    }
    return { tech: Array.from(tech).sort(), deps };
  }

  // Rust (Cargo.toml)
  const cargoTomlPath = fileList.find((f) => f.endsWith("Cargo.toml"));
  if (cargoTomlPath) {
    tech.add("Rust");
    const content = await getFileContentFn(cargoTomlPath);
    if (content) {
      try {
        const lines = content.split("\n");
        let inDependencies = false;
        lines.forEach((line) => {
          line = line.trim();
          if (line === "[dependencies]") {
            inDependencies = true;
          } else if (line.startsWith("[") && inDependencies) {
            inDependencies = false;
          } else if (inDependencies && line && !line.startsWith("#")) {
            const [name, version] = line
              .split("=")
              .map((s) => s.trim().replace(/['"]/g, ""));
            if (name && version) deps[name] = version;
            else if (name) deps[name] = "latest";
          }
        });
      } catch (e) {
        console.warn(`Failed to parse Cargo.toml at ${cargoTomlPath}:`, e);
      }
    }
    return { tech: Array.from(tech).sort(), deps };
  }

  // Go (go.mod)
  const goModPath = fileList.find((f) => f.endsWith("go.mod"));
  if (goModPath) {
    tech.add("Go");
    const content = await getFileContentFn(goModPath);
    if (content) {
      try {
        const lines = content.split("\n");
        lines.forEach((line) => {
          if (line.startsWith("require ")) {
            const parts = line.replace("require ", "").trim().split(" ");
            const name = parts[0];
            const version = parts[1] || "latest";
            if (name) deps[name] = version;
          }
        });
      } catch (e) {
        console.warn(`Failed to parse go.mod at ${goModPath}:`, e);
      }
    }
    return { tech: Array.from(tech).sort(), deps };
  }

  // Java (pom.xml)
  const pomXmlPath = fileList.find((f) => f.endsWith("pom.xml"));
  if (pomXmlPath) {
    tech.add("Java (Maven)");
    const content = await getFileContentFn(pomXmlPath);
    if (content) {
      try {
        const regex =
          /<dependency>[\s\S]*?<groupId>(.*?)<\/groupId>[\s\S]*?<artifactId>(.*?)<\/artifactId>[\s\S]*?<version>(.*?)<\/version>[\s\S]*?<\/dependency>/g;
        let match;
        while ((match = regex.exec(content)) !== null) {
          const [, , artifactId, version] = match;
          if (artifactId && version) deps[artifactId] = version;
        }
      } catch (e) {
        console.warn(`Failed to parse pom.xml at ${pomXmlPath}:`, e);
      }
    }
    return { tech: Array.from(tech).sort(), deps };
  }

  // Flutter (pubspec.yaml)
  const pubspecPath = fileList.find((f) => f.endsWith("pubspec.yaml"));
  if (pubspecPath) {
    tech.add("Flutter");
    const content = await getFileContentFn(pubspecPath);
    if (content) {
      try {
        const lines = content.split("\n");
        lines.forEach((line) => {
          const [name, version] = line.split(":").map((p) => p.trim());
          if (name && version && !name.startsWith("#") && version) {
            deps[name] = version;
          }
        });
      } catch (e) {
        console.warn(`Failed to parse pubspec.yaml at ${pubspecPath}:`, e);
      }
    }
    return { tech: Array.from(tech).sort(), deps };
  }

  // .NET (C# - .csproj)
  const csprojPath = fileList.find((f) => f.endsWith(".csproj"));
  if (csprojPath) {
    tech.add(".NET");
    const content = await getFileContentFn(csprojPath);
    if (content) {
      try {
        const regex = /<PackageReference Include="(.*?)" Version="(.*?)" \/>/g;
        let match;
        while ((match = regex.exec(content)) !== null) {
          const [, name, version] = match;
          deps[name] = version;
        }
      } catch (e) {
        console.warn(`Failed to parse .csproj at ${csprojPath}:`, e);
      }
    }
    return { tech: Array.from(tech).sort(), deps };
  }

  // Native Android (AndroidManifest.xml or build.gradle)
  if (
    fileList.some(
      (f) => f.includes("AndroidManifest.xml") || f.includes("build.gradle")
    )
  ) {
    tech.add("Android (Native)");
  }

  // Native iOS (Xcode project or Info.plist)
  if (
    fileList.some((f) => f.endsWith(".xcodeproj") || f.includes("Info.plist"))
  ) {
    tech.add("iOS (Native)");
  }

  return { tech: Array.from(tech).sort(), deps };
}

async function detectRunCommands(
  fileList: string[],
  getFileContentFn: (path: string) => Promise<string | null>
): Promise<Array<{ name: string; cmd: string }>> {
  let cmds: { name: string; cmd: string }[] = [];

  const packageJsonPath = fileList.find((f) => f.endsWith("package.json"));
  if (packageJsonPath) {
    const content = await getFileContentFn(packageJsonPath);
    if (content) {
      try {
        const pkg = JSON.parse(content);
        if (pkg.scripts) {
          for (const name in pkg.scripts) {
            cmds.push({ name, cmd: `npm run ${name}` });
          }
        }
      } catch (e) {
        console.warn(
          `Failed to parse package.json for scripts at ${packageJsonPath}:`,
          e
        );
      }
    }
  }

  const makefilePath = fileList.find((f) => f.endsWith("Makefile"));
  if (makefilePath) {
    const content = await getFileContentFn(makefilePath);
    if (content) {
      try {
        content.split("\n").forEach((line) => {
          const match = line.match(/^([a-zA-Z0-9_-]+):/);
          if (match && !match[1].startsWith(".")) {
            cmds.push({ name: match[1], cmd: `make ${match[1]}` });
          }
        });
      } catch (e) {
        console.warn(`Failed to parse Makefile at ${makefilePath}:`, e);
      }
    }
  }

  if (fileList.some((f) => f.endsWith("Cargo.toml"))) {
    cmds.push({ name: "Build", cmd: "cargo build" });
    cmds.push({ name: "Run", cmd: "cargo run" });
    cmds.push({ name: "Test", cmd: "cargo test" });
  }

  if (fileList.some((f) => f.endsWith("go.mod"))) {
    cmds.push({ name: "Run", cmd: "go run ." });
    cmds.push({ name: "Build", cmd: "go build" });
  }

  return cmds;
}

async function findLicense(
  fileList: string[],
  getFileContentFn: (path: string) => Promise<string | null>
): Promise<string | null> {
  // 1. Prioritize package.json for explicit license type
  const rootPackageJsonPath = fileList.find((f) => f === "package.json");
  const packageJsonPath =
    rootPackageJsonPath || fileList.find((f) => f.endsWith("package.json"));

  if (packageJsonPath) {
    const content = await getFileContentFn(packageJsonPath);
    if (content) {
      try {
        const pkg = JSON.parse(content);
        if (pkg.license) {
          const license =
            typeof pkg.license === "string" ? pkg.license : pkg.license.type;
          if (license) return license;
        }
      } catch (e) {
        console.warn(
          `Failed to parse package.json for license at ${packageJsonPath}:`,
          e
        );
      }
    }
  }

  // 2. If not in package.json, find and read the license file
  const licenseFile = fileList.find(
    (f) =>
      f.toLowerCase().startsWith("license") ||
      f.toLowerCase().startsWith("licence")
  );
  if (licenseFile) {
    const content = await getFileContentFn(licenseFile);
    if (content) {
      // Simple check for common license names in the first few lines
      const firstLines = content.substring(0, 200).toLowerCase();
      if (firstLines.includes("mit license")) return "MIT";
      if (firstLines.includes("apache license 2.0")) return "Apache-2.0";
      if (firstLines.includes("gnu general public license")) return "GPL";
      if (firstLines.includes("bsd 3-clause")) return "BSD-3-Clause";
      if (firstLines.includes("bsd 2-clause")) return "BSD-2-Clause";
      if (firstLines.includes("mozilla public license 2.0")) return "MPL-2.0";
      if (firstLines.includes("the unlicense")) return "Unlicense";
    }

    // 3. As a fallback, use the filename without extension
    const name = licenseFile.split("/").pop() || licenseFile;
    return name.split(".")[0];
  }

  return null;
}

async function detectProjectFeatures(
  fileList: string[],
  getFileContentFn: (path: string) => Promise<string | null>
): Promise<string[]> {
  const features = new Set<string>();

  if (fileList.some((f) => f.includes("api/"))) features.add("api");
  if (fileList.some((f) => f.includes("database/") || f.includes("db/")))
    features.add("database");
  if (fileList.some((f) => f.includes("auth/"))) features.add("auth");
  if (fileList.some((f) => f.includes("test/") || f.includes("tests/")))
    features.add("testing");
  if (fileList.some((f) => f.includes("cli/"))) features.add("cli");
  if (
    fileList.some(
      (f) =>
        f.includes("src/pages") ||
        f.includes("src/views") ||
        f.includes("app/routes")
    )
  )
    features.add("web");

  const packageJsonPath = fileList.find((f) => f.endsWith("package.json"));
  if (packageJsonPath) {
    const content = await getFileContentFn(packageJsonPath);
    if (content) {
      try {
        const pkg = JSON.parse(content);
        const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
        if (
          Object.keys(allDeps).some((d) =>
            ["express", "fastify", "koa", "next", "nest"].some((fw) =>
              d.includes(fw)
            )
          )
        )
          features.add("web");
        if (allDeps["react-native"]) features.add("mobile");
        if (allDeps["electron"]) features.add("desktop");
        if (
          Object.keys(allDeps).some((d) =>
            ["tensorflow", "brain.js", "pytorch"].some((ai) => d.includes(ai))
          )
        )
          features.add("ai");
        if (
          Object.keys(allDeps).some((d) =>
            ["web3", "ethers"].some((bc) => d.includes(bc))
          )
        )
          features.add("blockchain");
        if (
          Object.keys(allDeps).some((d) =>
            ["phaser", "pixi.js"].some((g) => d.includes(g))
          )
        )
          features.add("game");
      } catch (e) {
        console.warn(
          `Failed to parse package.json for features at ${packageJsonPath}:`,
          e
        );
      }
    }
  }

  return Array.from(features);
}

function generateBadges(tech: string[], license: string | null): string {
  let badges: string[] = [];

  const badgeTech = [
    "Python",
    "Node.js",
    "React",
    "TypeScript",
    "Docker",
    "Next.js",
    "React Native",
    "Flask",
    "Django",
    "Flutter",
    ".NET",
  ];
  for (const t of tech) {
    if (badgeTech.includes(t)) {
      const slug = t.toLowerCase().replace(".js", "js").replace(" ", "");
      badges.push(
        `![${t}](https://img.shields.io/badge/-${t}-blue?logo=${slug}&logoColor=white)`
      );
    }
  }

  if (license) {
    const licenseType = license.replace(/[^a-zA-Z0-9-]/g, "");
    badges.push(
      `![License](https://img.shields.io/badge/license-${licenseType}-green)`
    );
  }

  return badges.join(" ");
}

function generateVisualMap(fileList: string[]): string {
  const ignoreDirs = new Set([
    ".venv",
    "__pycache__",
    "node_modules",
    "vendor",
    ".git",
    ".github",
    ".vscode",
    ".idea",
    "dist",
    "build",
    "bin",
    "obj",
    "out",
    "coverage",
    "logs",
    "temp",
    "android",
    "ios",
    ".gradle",
    "Pods",
    "Carthage",
    ".dart_tool",
  ]);
  const ignoreFiles = new Set([
    "package-lock.json",
    "yarn.lock",
    ".env",
    ".env.local",
    ".gitignore",
    ".gitattributes",
    ".editorconfig",
    "README.md",
  ]);

  const filteredFiles = fileList.filter((p) => {
    const parts = p.split("/");
    if (parts.some((part) => ignoreDirs.has(part))) {
      return false;
    }
    const fileName = parts[parts.length - 1];
    if (
      ignoreFiles.has(fileName) ||
      fileName.includes(".min.") ||
      fileName.endsWith(".log") ||
      fileName.endsWith(".tmp") ||
      fileName.endsWith(".bak") ||
      fileName.endsWith(".swp") ||
      fileName.startsWith(".")
    ) {
      return false;
    }
    return true;
  });

  let tree: any = {};
  let rootDir = "";
  // Check if paths have a common root (for local folder uploads)
  if (filteredFiles.length > 0 && filteredFiles[0].includes("/")) {
    const firstPathParts = filteredFiles[0].split("/");
    if (firstPathParts.length > 1) {
      const potentialRoot = firstPathParts[0];
      if (filteredFiles.every((p) => p.startsWith(potentialRoot + "/"))) {
        rootDir = potentialRoot;
      }
    }
  }

  filteredFiles.forEach((path) => {
    // If there's a common root, strip it for tree building
    const pathParts =
      rootDir && path.startsWith(rootDir + "/")
        ? path.substring(rootDir.length + 1).split("/")
        : path.split("/");

    let currentLevel = tree;
    pathParts.forEach((part) => {
      if (!part) return;
      if (!currentLevel[part]) {
        currentLevel[part] = {};
      }
      currentLevel = currentLevel[part];
    });
  });

  function buildTree(subtree: any, indent: string): string {
    let result = "";
    const keys = Object.keys(subtree).sort();
    keys.forEach((key, index) => {
      const isLast = index === keys.length - 1;
      result += `${indent}${isLast ? "└──" : "├──"} ${key}\n`;
      if (Object.keys(subtree[key]).length > 0) {
        result += buildTree(
          subtree[key],
          `${indent}${isLast ? "    " : "│   "}`
        );
      }
    });
    return result;
  }

  const projectRoot = rootDir || ".";
  return "```\n" + projectRoot + "\n" + buildTree(tree, "") + "```";
}

function generateDevelopmentSetup(tech: string[]): string {
  let setup = ["## 🛠️ Development Setup"];

  if (
    tech.includes("Node.js") ||
    tech.includes("React") ||
    tech.includes("React Native") ||
    tech.includes("Next.js") ||
    tech.includes("Vue.js") ||
    tech.includes("Angular") ||
    tech.includes("Svelte")
  ) {
    setup.push(`
### Node.js/JavaScript Setup
1. Install Node.js (v18+ recommended)
2. Install dependencies: \`npm install\` or \`yarn install\`
3. Start development server: (Check scripts in \`package.json\`, e.g., \`npm run dev\`)
`);
  }

  if (tech.includes("Python")) {
    setup.push(`
### Python Setup
1. Install Python (v3.8+ recommended)
2. Create a virtual environment: \`python -m venv venv\`
3. Activate the environment:
   - Windows: \`venv\\Scripts\\activate\`
   - Unix/MacOS: \`source venv/bin/activate\`
4. Install dependencies: \`pip install -r requirements.txt\`
`);
  }

  if (tech.includes("Docker")) {
    setup.push(`
### Docker Setup
1. Install Docker
2. Build the image: \`docker build -t my-project-name .\`
3. Run the container: \`docker run -p 3000:3000 my-project-name\`
`);
  }

  if (tech.includes("Rust")) {
    setup.push(`
### Rust Setup
1. Install Rust (via rustup: https://rustup.rs/)
2. Install dependencies: \`cargo build\`
3. Run the project: \`cargo run\`
`);
  }

  if (tech.includes("Go")) {
    setup.push(`
### Go Setup
1. Install Go (v1.18+ recommended)
2. Install dependencies: \`go mod download\`
3. Run the project: \`go run .\`
`);
  }

  if (tech.includes(".NET")) {
    setup.push(`
### .NET Setup
1. Install [.NET SDK](https://dotnet.microsoft.com/)
2. Restore dependencies: \`dotnet restore\`
3. Build the project: \`dotnet build\`
4. Run the project: \`dotnet run\`
`);
  }

  if (tech.includes("Flutter")) {
    setup.push(`
### Flutter Setup
1. Install [Flutter SDK](https://flutter.dev/docs/get-started/install)
2. Run: \`flutter pub get\`
3. Start the app: \`flutter run\`
`);
  }

  if (tech.includes("Android (Native)")) {
    setup.push(`
### Native Android Setup
1. Open project in Android Studio
2. Sync Gradle and build project
3. Run on emulator or connected device
`);
  }

  if (tech.includes("iOS (Native)")) {
    setup.push(`
### Native iOS Setup
1. Open Xcode project (.xcodeproj or .xcworkspace)
2. Install dependencies (e.g. via CocoaPods)
3. Build and run on simulator or device
`);
  }

  if (tech.includes("Java (Maven)")) {
    setup.push(`
### Java (Maven) Setup
1. Install Java (JDK 11+ recommended)
2. Install Maven
3. Install dependencies: \`mvn install\`
4. Run the project: \`mvn exec:java\` or check \`pom.xml\` for specific run commands
`);
  }

  if (setup.length === 1) return "";

  return setup.join("\n");
}

function generateContributingGuide(repoUrl?: string): string {
      const cloneUrl = repoUrl ? repoUrl.replace(/\.git$/, '') + '.git' : 'https://github.com/your-username/repo.git';

  return `## 👥 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Clone** your fork: \`git clone ${cloneUrl}\`
3. **Create** a new branch: \`git checkout -b feature/your-feature\`
4. **Commit** your changes: \`git commit -am 'Add some feature'\`
5. **Push** to your branch: \`git push origin feature/your-feature\`
6. **Open** a pull request

Please ensure your code follows the project's style guidelines and includes tests where applicable.`;
}

export async function assembleReadme({
  name,
  fileList,
  getFileContentFn,
  initialDescription,
  repoUrl,
  ai,
}: AssembleReadmeParams): Promise<string> {
  const { tech, deps } = await detectStackAndDependencies(
    fileList,
    getFileContentFn
  );
  const cmds = await detectRunCommands(fileList, getFileContentFn);
  const license = await findLicense(fileList, getFileContentFn);
  const detectedFeatures = await detectProjectFeatures(
    fileList,
    getFileContentFn
  );

  const allFeatures = [...new Set([...detectedFeatures])];

  const { enhancedDescription } = await ai.enhanceDescription({
    projectName: name,
    originalDescription: initialDescription,
    techStack: tech.join(", "),
    features: allFeatures.join(", "),
  });

  let lines = [
    `# ${name}\n`,
    generateBadges(tech, license) + "\n",
    `## 📝 Description\n\n${enhancedDescription}\n`,
  ];

  if (allFeatures.length > 0) {
    lines.push(`## ✨ Features\n`);
    lines.push(
      ...allFeatures.map(
        (f) =>
          `- ${featureEmojis[f] || "•"} ${
            f.charAt(0).toUpperCase() + f.slice(1)
          }`
      )
    );
    lines.push("\n");
  }

  if (tech.length > 0) {
    lines.push(`## 🛠️ Tech Stack\n`);
    lines.push(...tech.map((t) => `- ${techIcons[t] || "•"} ${t}`));
    lines.push("\n");
  }

  if (Object.keys(deps).length > 0) {
    lines.push(`## 📦 Key Dependencies\n`);
    lines.push("```");
    lines.push(
      ...Object.entries(deps)
        .slice(0, 15)
        .map(([name, version]) => `${name}: ${version}`)
    );
    lines.push("```\n");
  }

  if (cmds.length > 0) {
    lines.push(`## 🚀 Run Commands\n`);
    lines.push(...cmds.map((c) => `- **${c.name}**: \`${c.cmd}\``));
    lines.push("\n");
  }

  lines.push(`## 📁 Project Structure\n`);
  lines.push(generateVisualMap(fileList) + "\n");

  const devSetup = generateDevelopmentSetup(tech);
  if (devSetup) {
    lines.push(devSetup + "\n");
  }

    lines.push(generateContributingGuide(repoUrl) + "\n");


  if (license) {
    lines.push(`## 📜 License\n`);
    lines.push(`This project is licensed under the ${license} License.\n`);
  }

  lines.push(`---\n*This README was generated with ❤️ by ReadmeBuddy*`);

  return lines.join("\n");
}
