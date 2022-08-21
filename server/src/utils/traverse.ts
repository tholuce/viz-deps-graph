import { PackageFile } from "../interfaces/package";
import { readdirSync, existsSync } from "fs";
import { join, resolve } from "path";

const PACKAGE_FILE_NAME = "package.json";

const getPackageFile = (path: string): PackageFile | null => {
  const absolutePackage = join(path, PACKAGE_FILE_NAME);

  if (!existsSync(absolutePackage)) {
    return null;
  }

  return JSON.parse(join(path, PACKAGE_FILE_NAME)) as PackageFile;
};

const getPackages = (path: string): PackageFile[] => {
  const packageFile = getPackageFile(path);
  if (packageFile !== null) {
    return [packageFile];
  }

  let packageFiles: PackageFile[] = [];
  readdirSync(path, { withFileTypes: true })
    .filter((item) => item.isDirectory)
    .forEach(({ name }) => {
      packageFiles = packageFiles.concat(getPackages(join(path, name)));
    });

  return packageFiles;
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
  return getPackages(absPath);
};
