import { PackageFile } from "../interfaces/package";
import { readdirSync, existsSync, readFileSync } from "fs";
import { join, resolve } from "path";

const PACKAGE_FILE_NAME = "package.json";

const getPackageFile = (parentDir: string): PackageFile | null => {
  const absolutePackage: string = join(parentDir, PACKAGE_FILE_NAME);

  if (!existsSync(absolutePackage)) {
    return null;
  }

  return JSON.parse(
    readFileSync(join(parentDir, PACKAGE_FILE_NAME), {
      encoding: "utf8",
    })
  ) as PackageFile;
};

const getPackageFromDirs = (path: string): PackageFile[] => {
  let packageFiles: PackageFile[] = [];
  const directoryContent = readdirSync(path, { withFileTypes: true });
  directoryContent
    .filter((item) => item.isDirectory())
    .forEach(({ name }) => {
      try {
        packageFiles = packageFiles.concat(getPackages(join(path, name)));
      } catch {
        return [];
      }
    });
  return packageFiles;
};

const getPackages = (path: string): PackageFile[] => {
  const packageFile = getPackageFile(path);
  if (packageFile !== null) {
    return [packageFile];
  }

  return getPackageFromDirs(path);
};

export const getAllPackages = (
  rootDir: string,
  ignoreRootPackageFile: boolean = true
) => {
  const absPath = resolve(rootDir);
  if (!ignoreRootPackageFile) {
    const packageFile = getPackageFile(absPath);
    if (packageFile !== null) {
      return [packageFile];
    }
  }
  return getPackageFromDirs(absPath);
};
