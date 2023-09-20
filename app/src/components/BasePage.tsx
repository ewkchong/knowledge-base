import { gql, useQuery } from '@apollo/client';
import { CircularProgress, Dialog } from '@mui/material';
import React, { FormEvent, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { client } from '..';
import BackBar from './BackBar';
import { GraphData, GraphEdge } from './chart/graphData';
import { DocChart } from './DocChart';

export async function loader({ params }: any) {
	return params.baseId;
}

const BasePage = () => {
	const baseId = useLoaderData();
	const navigate = useNavigate();
	const [modalOpen, setModalOpen] = useState(false);
	const handleOpen = () => setModalOpen(true);
	const handleClose = () => setModalOpen(false);

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

	const handleCreateDoc = (e: FormEvent) => {
		e.preventDefault()
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);

		const { title } = Object.fromEntries(formData.entries());

		const ADD_DOC_MUT = gql`
			mutation addDocToBase($baseId: String!, $title: String!) {
			  addDocToBase(baseId: $baseId, title: $title) {
				  id
			  }
			}
		`

		client.mutate({
			mutation: ADD_DOC_MUT,
			variables: {
				baseId: baseId,
				title
			}
		}).then((result) => {
			console.log(result);
			const { data: {
				addDocToBase: {
					id
				}
			}
			} = result;
			navigate(`/bases/${baseId}/${id}`);
		}).catch((error) => {
			console.error(error);
		})
	}

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
			<BackBar nav=".." />
			<div>
				<div className="bg-white pt-24 sm:py-2">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<div className="mx-auto max-w-2xl lg:mx-0">
							<h3 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{base.title}</h3>
							<p className="mt-2 text-lg leading-8 text-gray-600 mb-24">
								{base.description}
							</p>
						</div>
					</div>
					<div className="mb-4 w-fit ml-auto mx-4 bg-indigo-600 hover:bg-indigo-500 rounded px-4 py-1 text-white cursor-pointer font-light active:bg-indigo-400 transition-colors" onClick={handleOpen}>
						+ Add
					</div>
					<Dialog
						open={modalOpen}
						onClose={handleClose}>
						<div className="sm:mx-auto sm:w-full sm:max-w-sm p-12">
							<div className="text-center text-lg font-bold mb-6">
								Create a New Document
							</div>
							<form className="space-y-6" onSubmit={handleCreateDoc}>
								<div>
									<label className="block text-sm font-medium leading-6 text-gray-900">
										Title
									</label>
									<div className="mt-2">
										<input
											id="title"
											name="title"
											required
											className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
										/>
									</div>
								</div>
								<div>
									<button
										type="submit"
										className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
									>
										Create
									</button>
								</div>
							</form>
						</div>
					</Dialog>
				</div>
				<DocChart data={graphData} />
			</div>
		</>
	);
}

export default BasePage;
