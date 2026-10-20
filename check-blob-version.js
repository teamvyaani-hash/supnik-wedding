
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const blob = require("@vercel/blob/package.json");

console.log("Installed @vercel/blob version:", blob.version);
console.log("Package exports:", blob.exports);
