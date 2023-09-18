import { gql, useQuery } from '@apollo/client';
import { CircularProgress } from '@mui/material';
import React from 'react';
import { useLoaderData } from 'react-router-dom';
import BackBar from './BackBar';
import { GraphData, GraphEdge } from './chart/graphData';
import { DocChart } from './DocChart';
import { data as exampleData } from './utils/exampleData';

export async function loader({ params }: any) {
	return params.baseId;
}

const BasePage = () => {
	const baseId = useLoaderData();

	const BASE_QUERY = gql`
		query getBases {
			base(id: "${baseId}") {
				title
				description
				documents {
					id
					title
					linked {
						id
						title
					}
				}
			}
		}
	`

	const { loading, error, data } = useQuery(BASE_QUERY)

	if (loading) {
		return <CircularProgress />
	}

	if (error) {
		throw new Error("graphQL error")
	}

	const { base } = data;
	const documents: any[] = base.documents;
	const links: GraphEdge[] = [];

	for (const doc of documents) {
		for (const link of doc.linked) {
			links.push({
						source: doc.id,
						target: link.id,
						value: Math.random() * 10
					})
		}
	}

	const graphData: GraphData = {
		nodes: documents.map((doc) => {
						   return {
							   id: doc.id,
							   title: doc.title
						   }
					   }),
		links
	}
	
	return (
		<>
		<BackBar />
		<div>
			<div className="bg-white py-24 sm:py-32">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl lg:mx-0">
						<h3 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{base.title}</h3>
						<p className="mt-2 text-lg leading-8 text-gray-600">
						{base.description}
						</p>
					</div>
				</div>
			</div>
			<DocChart data={graphData} />
		</div>
		</>
	);
}

export default BasePage;
