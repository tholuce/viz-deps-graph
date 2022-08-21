export interface PackageFile {
  name: string;
  version: string;
  dependencies: { [key: string]: string };
}
