import { select, zoomIdentity } from 'd3';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { ForceGraph, GraphData, GraphEdge, GraphNode } from './chart/graphData';

export const DocChart = ({ data }: { data: GraphData }) => {
	const navigate = useNavigate();

	function click({ id }: any) {
		navigate(`${id}`)
	}

	const graph: any = ForceGraph({
		nodes: data.nodes,
		links: data.links
	},
		{
			nodeId: (d: any) => d.id,
			nodeGroup: (d: any) => d.group,
			nodeTitle: (d: GraphNode) => `${d.title}`,
			clickCallback: click,
			nodeRadius: 5,
			width: 1168,
			height: 600,
		})

	return <div className="border border-gray-200 bg-gray-50" ref={ref => {
		if (!graph || !ref) return null;
		const res = ref.appendChild(graph.node())

		var parent = graph.node().parentElement;
		var fullWidth = parent.clientWidth,
		  fullHeight = parent.clientHeight;

		graph.attr("viewBox", [-fullWidth/2, -fullHeight/2, fullWidth, fullHeight])

		return res;
	}}></div>;
}
