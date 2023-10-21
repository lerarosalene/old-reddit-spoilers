const fs = require("node:fs");
const path = require("node:path");
const esbuild = require("esbuild");
const Header = require("userscript-header-format");

const fsp = fs.promises;

async function main() {
  const pkg = JSON.parse(await fsp.readFile("package.json", "utf-8"));

  const headerDesc = {
    name: "Old Reddit Spoilers Fix",
    namespace: "https://lerarosalene.github.io",
    version: pkg.version,
    description: pkg.descriptopn,
    author: pkg.author,
    match: "*://*.reddit.com/*",
    icon: "https://icons.duckduckgo.com/ip3/reddit.com.ico",
    license: pkg.license,
  };

  if (process.env.UPDATE_URL) {
    headerDesc.downloadURL = headerDesc.updateURL = process.env.UPDATE_URL;
  }

  const header = Header.fromObject(headerDesc).toString();

  await esbuild.build({
    entryPoints: [path.join("src", "index.ts")],
    bundle: true,
    outfile: path.join("dist", `${pkg.name}.user.js`),
    loader: {
      ".css": "text",
    },
    banner: {
      js: header.toString() + "\n",
    },
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
