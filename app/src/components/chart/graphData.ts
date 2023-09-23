// @ts-nocheck

import * as d3 from 'd3';
import { select, zoomIdentity } from 'd3';

export type GraphNode = {
	id: string
	title?: string
	group?: number
}

export type GraphEdge = {
	source: string
	target: string
	value: number
}

export type GraphData = {
	nodes: GraphNode[]
	links: GraphEdge[]
}

// ALL CREDIT GOES TO @shreshthmohan ON OBSERVABLE
// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/force-directed-graph
export function ForceGraph(
	{
		nodes, // an iterable of node objects (typically [{id}, …])
		links // an iterable of link objects (typically [{source, target}, …])
	},
	{
		nodeId = (d) => d.id, // given d in nodes, returns a unique identifier (string)
		nodeGroup, // given d in nodes, returns an (ordinal) value for color
		nodeGroups, // an array of ordinal values representing the node groups
		nodeTitle, // given d in nodes, a title string
		nodeFill = "currentColor", // node stroke fill (if not using a group color encoding)
		nodeStroke = "#fff", // node stroke color
		nodeStrokeWidth = 1.5, // node stroke width, in pixels
		nodeStrokeOpacity = 1, // node stroke opacity
		nodeRadius = 5, // node radius, in pixels
		nodeStrength,
		linkSource = ({ source }) => source, // given d in links, returns a node identifier string
		linkTarget = ({ target }) => target, // given d in links, returns a node identifier string
		linkStroke = "#999", // link stroke color
		linkStrokeOpacity = 0.6, // link stroke opacity
		linkStrokeWidth = 1.5, // given d in links, returns a stroke width in pixels
		linkStrokeLinecap = "round", // link stroke linecap
		linkStrength,
		colors = d3.schemeTableau10, // an array of color strings, for the node groups
		width = 640, // outer width, in pixels
		height = 400, // outer height, in pixels
		clickCallback,
	}: any = {}
) {
	// Compute values.
	const N = d3.map(nodes, nodeId).map(intern);
	const LS = d3.map(links, linkSource).map(intern);
	const LT = d3.map(links, linkTarget).map(intern);
	if (nodeTitle === undefined) nodeTitle = (_, i) => N[i];
	const T = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
	const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
	const W =
		typeof linkStrokeWidth !== "function"
			? null
			: d3.map(links, linkStrokeWidth);
	const L = typeof linkStroke !== "function" ? null : d3.map(links, linkStroke);

	// Replace the input nodes and links with mutable objects for the simulation.
	nodes = d3.map(nodes, (_, i) => ({ id: N[i] }));
	links = d3.map(links, (_, i) => ({ source: LS[i], target: LT[i] }));

	// Compute default domains.
	if (G && nodeGroups === undefined) nodeGroups = d3.sort(G);

	// Construct the scales.
	const color = nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);

	// Construct the forces.
	const forceNode = d3.forceManyBody()
		.strength(-1000)
        .distanceMax(250)
        .distanceMin(80)
	const forceLink = d3.forceLink(links).id(({ index: i }) => N[i]);
	// if (nodeStrength !== undefined) forceNode.strength(nodeStrength);
	if (linkStrength !== undefined) forceLink.strength(0.76);

	const simulation = d3
		.forceSimulation(nodes)
		.force("link", forceLink)
		.force("charge", forceNode)
		.force("collide", d3.forceCollide().radius(70).strength(0.45))
		.force("x", d3.forceX(0).strength(0.25))
		.force("y", d3.forceY(0).strength(0.25))
		.on("tick", ticked);

	const svg = d3
		.create("svg")
		.attr("id", "graph-svg")
		// .attr("width", width)
		// .attr("height", height)
		.attr("viewBox", [-width / 2, -height / 2, width, height])
		.attr("style", "max-width: 100%; height: auto; height: intrinsic;");

	const link = svg
		.append("g")
		.attr("stroke", typeof linkStroke !== "function" ? linkStroke : null)
		.attr("stroke-opacity", linkStrokeOpacity)
		.attr(
			"stroke-width",
			typeof linkStrokeWidth !== "function" ? linkStrokeWidth : null
		)
		.attr("stroke-linecap", linkStrokeLinecap)
		.selectAll("line")
		.data(links)
		.join("line");

	const node = svg
		.append("g")
		.attr("fill", nodeFill)
		.attr("stroke", nodeStroke)
		.attr("stroke-opacity", nodeStrokeOpacity)
		.attr("stroke-width", nodeStrokeWidth)
		.on("click", (d, i) => {
			console.log("clicked document");
			clickCallback(d.target.__data__);
		})
		// SM: change
		// .selectAll("circle")
		.selectAll("g")
		.data(nodes)
		// SM: change
		// .join("circle")
		.join("g")
		// SM: change
		// .attr("r", nodeRadius)
		.call(drag(simulation));

	// SM: change
	// append circle and text to node <g> (selection of all <g> elements corresponding to each node)
	node.append("circle").attr("r", nodeRadius)
		.on('mouseover', function(d, i) {
			d3.select(this)
				.transition(d3.easeCubic())
				.duration(200)
				.attr('r', nodeRadius * 1.4)
		})
		.on('mouseout', function(d, i) {
			d3.select(this)
				.transition(d3.easeCubic())
				.duration(200)
				.attr('r', nodeRadius)
		})
	node
		.append("text")
		.text(({ index: i }) => T[i])
		.attr("transform", (d: any) => `translate(-10 25)`)
		.attr("fill", "gray")
		.attr("stroke", "none")
		.attr("font-size", "0.9em");

	if (W) link.attr("stroke-width", ({ index: i }) => W[i]);
	if (L) link.attr("stroke", ({ index: i }) => L[i]);
	if (G) node.attr("fill", ({ index: i }) => color(G[i]));
	if (T) node.append("title").text(({ index: i }) => T[i]);
	// if (invalidation != null) invalidation.then(() => simulation.stop());

	function intern(value) {
		return value !== null && typeof value === "object"
			? value.valueOf()
			: value;
	}

	function ticked() {
		link
			.attr("x1", (d) => d.source.x)
			.attr("y1", (d) => d.source.y)
			.attr("x2", (d) => d.target.x)
			.attr("y2", (d) => d.target.y);

		node.attr("transform", (d) => `translate(${d.x} ${d.y})`);
		// SM: change
		// instead of moving the circle centers we transform the whole <g>
		// .attr("cx", d => d.x)
		// .attr("cy", d => d.y);
	}

	function drag(simulation) {
		function dragstarted(event) {
			if (!event.active) simulation.alphaTarget(0.3).restart();
			event.subject.fx = event.subject.x;
			event.subject.fy = event.subject.y;
		}

		function dragged(event) {
			event.subject.fx = event.x;
			event.subject.fy = event.y;
		}

		function dragended(event) {
			if (!event.active) simulation.alphaTarget(0);
			event.subject.fx = null;
			event.subject.fy = null;
		}

		return d3
			.drag()
			.on("start", dragstarted)
			.on("drag", dragged)
			.on("end", dragended);
	}

	return Object.assign(svg, { scales: { color } });
}

function drawChart(data: GraphData) {

	// Specify the dimensions of the chart.
	const width = 928;
	const height = 600;

	// Specify the color scale.
	const color = d3.scaleOrdinal(d3.schemeCategory10);

	// The force simulation mutates links and nodes, so create a copy
	// so that re-evaluating this cell produces the same result.
	const links: GraphEdge[] = data.links.map((d: any) => ({ ...d }));
	const nodes: GraphNode[] = data.nodes.map((d: any) => ({ ...d }));

	// Create a simulation with several forces.
	const simulation = d3.forceSimulation(nodes as any)
		.force("link", d3.forceLink(links).id((d: any) => d.id))
		.force("charge", d3.forceManyBody())
		.force("center", d3.forceCenter(width / 2, height / 2))
		.on("tick", ticked);

	// Create the SVG container.
	const svg = d3.create("svg")
		.attr("width", width)
		.attr("height", height)
		.attr("viewBox", [0, 0, width, height])
		.attr("style", "max-width: 100%; height: auto;");

	// Add a line for each link, and a circle for each node.
	const link = svg.append("g")
		.attr("stroke", "#999")
		.attr("stroke-opacity", 0.6)
		.selectAll()
		.data(links)
		.join("line")
		.attr("stroke-width", (d: any) => Math.sqrt(d.value));

	const node = svg.append("g")
		.attr("stroke", "#fff")
		.attr("stroke-width", 1.5)
		.selectAll()
		.data(nodes)
		.join("circle")
		.attr("r", 5)
		.attr("fill", (d: GraphNode) => color((d.group ?? 0).toString()));

	node.append("title")
		.text((d: any) => d.id);

	// Add a drag behavior.
	node.call(d3.drag()
		.on("start", dragstarted)
		.on("drag", dragged)
		.on("end", dragended));

	// Set the position attributes of links and nodes each time the simulation ticks.
	function ticked() {
		link
			.attr("x1", (d: any) => d.source.x)
			.attr("y1", (d: any) => d.source.y)
			.attr("x2", (d: any) => d.target.x)
			.attr("y2", (d: any) => d.target.y);

		node
			.attr("cx", (d: any) => d.x)
			.attr("cy", (d: any) => d.y);
	}

	// Reheat the simulation when drag starts, and fix the subject position.
	function dragstarted(event: any) {
		if (!event.active) simulation.alphaTarget(0.3).restart();
		event.subject.fx = event.subject.x;
		event.subject.fy = event.subject.y;
	}

	// Update the subject (dragged node) position during drag.
	function dragged(event: any) {
		event.subject.fx = event.x;
		event.subject.fy = event.y;
	}

	// Restore the target alpha so the simulation cools after dragging ends.
	// Unfix the subject position now that it’s no longer being dragged.
	function dragended(event: any) {
		if (!event.active) simulation.alphaTarget(0);
		event.subject.fx = null;
		event.subject.fy = null;
	}

	// When this cell is re-run, stop the previous simulation. (This doesn’t
	// really matter since the target alpha is zero and the simulation will
	// stop naturally, but it’s a good practice.)
	// invalidation.then(() => simulation.stop());

	return svg;
}

