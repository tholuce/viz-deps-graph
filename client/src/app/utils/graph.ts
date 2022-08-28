import { FullGraph, NodeSimulation, LinkSimulation } from "../interfaces/graph";
import { PackageFile } from "../interfaces/package";

export const buildGraphFromPackages = (packages: PackageFile[]): FullGraph => {
  const nodes: NodeSimulation[] = [];
  const links: LinkSimulation[] = [];
  const pkgRelation: { [key: string]: NodeSimulation } = {};
  const depRelation: { [key: string]: boolean } = {};
  for (const { name, version, dependencies } of packages) {
    const pkgKey = `${name}@${version}`;
    if (pkgRelation[pkgKey] === undefined) {
      const pkgNode: NodeSimulation = { name: pkgKey };
      pkgRelation[pkgKey] = pkgNode;
      nodes.push(pkgNode);
    }

    for (const [key, value] of Object.entries(dependencies)) {
      const targetKey = `${key}@${value}`;
      const depKey = `${pkgKey}:${targetKey}`;
      if (depRelation[depKey] === undefined) {
        depRelation[depKey] = true;
        const targetNode: NodeSimulation = { name: pkgKey };
        nodes.push(targetNode);
        links.push({ source: pkgRelation[pkgKey], target: targetNode });
      }
    }
  }
  return { nodes, links };
};

export const buildGraphAsync = (
  packages: PackageFile[]
): Promise<FullGraph | undefined> => {
  return new Promise((resolve, reject) => {
    try {
      resolve(buildGraphFromPackages(packages));
    } catch (e) {
      reject(e);
    }
  });
};
