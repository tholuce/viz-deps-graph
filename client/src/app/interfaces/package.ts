export type PackageFile = {
  name: string;
  version: string;
  location: string;
  dependencies: { [key: string]: string };
};
