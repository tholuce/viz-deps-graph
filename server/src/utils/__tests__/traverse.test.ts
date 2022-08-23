import { PackageFile } from "../../interfaces/package";
import { getAllPackages } from "../../utils/traverse";
import { existsSync, readdirSync, readFileSync } from "fs";
import { resolve, join } from "path";

const rootDirMock = "pages";

jest.mock("fs");
jest.mock("path");

const existsSyncMockFn = (path: string): boolean => {
  const packageFilePathes = [
    "pages/package.json",
    "pages/specific/package.json",
    "pages/home/package.json",
    "pages/category/package.json",
  ];
  return packageFilePathes.indexOf(path) >= 0;
};
const packageJsonFilesMockFn = (path: string) => {
  const data: { [key: string]: PackageFile } = {
    "pages/package.json": {
      name: "pages",
      version: "1.0.0",
      dependencies: { some: "^v0.0.1" },
    },
    "pages/specific/package.json": {
      name: "specific",
      version: "1.0.0",
      dependencies: { some: "^v0.0.1" },
    },
    "pages/home/package.json": {
      name: "home",
      version: "1.0.0",
      dependencies: { some: "^v0.0.1" },
    },
    "pages/category/package.json": {
      name: "category",
      version: "1.0.0",
      dependencies: { some: "^v0.0.1" },
    },
  };
  return JSON.stringify(data[path] || "{}");
};

const readdirMockFn = (path: string) => {
  const data: { [key: string]: any } = {
    pages: [
      { name: "home", isDirectory: () => true },
      { name: "specific", isDirectory: () => true },
      { name: "category", isDirectory: () => true },
    ],
    home: [{ name: "package.json", isDirectory: () => false }],
    specific: [{ name: "package.json", isDirectory: () => false }],
    category: [{ name: "package.json", isDirectory: () => false }],
  };
  return data[path];
};

beforeEach(() => {
  (resolve as jest.Mock).mockImplementation((...pathes: string[]) => {
    return pathes[0];
  });
  (join as jest.Mock).mockImplementation((...pathes: string[]) => {
    return pathes.join("/");
  });
  (existsSync as jest.Mock).mockImplementation(existsSyncMockFn);
  (readdirSync as jest.Mock).mockImplementation(readdirMockFn);
  (readFileSync as jest.Mock).mockImplementation(packageJsonFilesMockFn);
});

test.each([
  [true, ["home", "specific", "category"]],
  [false, ["pages"]],
])(
  "Should get correct package.json files",
  (ignoreRootPackageFile: boolean, expected: string[]) => {
    const packages = getAllPackages(rootDirMock, ignoreRootPackageFile);
    expect(Array.isArray(packages)).toBeTruthy();
    expect(packages.length).toBe(expected.length);
    expect(packages.map((el) => el.name)).toEqual(expected);
  }
);
