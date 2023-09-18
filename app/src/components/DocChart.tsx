import React from 'react'
import { useNavigate } from 'react-router-dom';
import { ForceGraph, GraphData, GraphEdge, GraphNode } from './chart/graphData';

export const DocChart = ({ data }: { data: GraphData }) => {
	const navigate = useNavigate();

	function click({ id }: any) {
		navigate(`${id}`)
	}

	const graph = ForceGraph({
		nodes: data.nodes,
		links: data.links
	},
		{
			nodeId: (d: any) => d.id,
			nodeGroup: (d: any) => d.group,
			nodeTitle: (d: GraphNode) => `${d.title}`,
			clickCallback: click,
			nodeStrength: - 100,
			linkStrength: 0.3,
			width: 962,
			height: 600,
		})

	return <div ref={ref => ref.appendChild(graph)}></div>;
}
