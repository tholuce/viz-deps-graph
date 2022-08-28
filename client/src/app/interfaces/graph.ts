import { SimulationNodeDatum, SimulationLinkDatum } from "d3";

export type NodeSimulation = SimulationNodeDatum & {
  name: string;
};

export type LinkSimulation = SimulationLinkDatum<NodeSimulation>;

export type FullGraph = {
  nodes: NodeSimulation[];
  links: LinkSimulation[];
};
