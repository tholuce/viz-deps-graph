import { getAllPackages } from "../../utils/traverse";
import fs from "fs";

const rootDirMock = "some-root-dir/";
jest;

test("is empty list", () => {
  expect(getAllPackages(rootDirMock)).toBe([]);
});
