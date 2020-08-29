import * as fs from "fs";
import * as path from "path";

export function scanDir(basePath: string, subPath: string = ""): string[] {
  const fullPath = path.join(basePath, subPath);
  if (fs.statSync(fullPath).isDirectory()) {
    const subPaths = fs.readdirSync(fullPath);
    return subPaths.map((p) => scanDir(basePath, path.join(subPath, p))).flat();
  }
  return [subPath];
}
