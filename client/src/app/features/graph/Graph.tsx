import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { NodeSimulation, LinkSimulation } from '../../interfaces/graph';

const nodes: NodeSimulation[] = [
    { name: 'asd' },
    { name: 'qdqwdd' },
    { name: '2' },
    { name: '12321' },
    { name: 'qdqwdd' },
    { name: '12123123' },
    { name: '12123123' }
];

const links: LinkSimulation[] = [
    { source: nodes[0], target: nodes[1] },
    { source: nodes[1], target: nodes[2] },
    { source: nodes[2], target: nodes[3] },
    { source: nodes[2], target: nodes[3] },
];

const drag = (forceSimulation: any) => {
    const dragstarted = (event: any, d: any) => {
        console.log("asda");
        if (!event.active) forceSimulation.alphaTarget(0.3).restart();

    };
    const dragged = (event: any, d: any) => {
        d.x = event.x;
        d.y = event.y;
    };
    const dragended = (event: any, d: any) => {
        if (!event.active) forceSimulation.alphaTarget(0);
    };
    return d3.drag<SVGElement, NodeSimulation>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
};

const Graph = () => {
    const svgRef = useRef<SVGSVGElement>(null);
    useEffect(() => {
        if (svgRef === null || svgRef.current === null) {
            return;
        }

        const svgElement = d3.select(svgRef.current);

        svgElement.attr('width', 500);
        svgElement.attr('height', 500);
        svgElement.attr('viewBox', '-250 -250 500 500');

        const force = d3.forceSimulation(nodes)
            .force('links', d3.forceLink(links).distance((() => 250)))
            .force("charge", d3.forceManyBody().strength(-150))
            .force("x", d3.forceX())
            .force("y", d3.forceY())
            .force("charge", d3.forceManyBody().strength(-150));

        const link = svgElement.append('g').attr('fill', '#ff0000')
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(links)
            .join("line");

        const node = svgElement.append('g').attr("stroke", "#ff0000")
            .attr("stroke-width", 2)
            .selectAll("g")
            .data(nodes)
            .enter()
            .append<SVGElement>("circle")
            .attr("r", 30)
            .attr("fill", '#ff0000').call(drag(force));

        const label = svgElement.append('g').selectAll('text').data<NodeSimulation>(nodes).enter().append<SVGElement>('text').attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'central').text('test').call(drag(force));

        label.on('click', () => console.log('asdsad'));
        label.on('mouseover', (data: NodeSimulation) => {
            console.log(`name: ${JSON.stringify(data)}`);
            node.filter(p => p.name === data.name).raise().attr('stroke', 'black');
        });
        label.on('mouseout', (event, d) => console.log('mouseout'));
        force.on("tick", () => {
            //update link positions
            link
                .attr("x1", d => (d.source as NodeSimulation).x || 0)
                .attr("y1", d => (d.source as NodeSimulation).y || 0)
                .attr("x2", d => (d.target as NodeSimulation).x || 0)
                .attr("y2", d => (d.target as NodeSimulation).y || 0);

            // update node positions
            node
                .attr("cx", d => d.x || 0)
                .attr("cy", d => d.y || 0);

            label
                .attr("x", d => { return d.x || 0; })
                .attr("y", d => { return d.y || 0; })
        });
    }, [svgRef]);
    return <svg ref={svgRef}></svg>;
};


export default Graph;