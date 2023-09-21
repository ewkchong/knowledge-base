import React, { FormEvent, useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import { CircularProgress, Dialog } from '@mui/material';
import Base from './Base';
import { client } from '..';
import { useNavigate } from 'react-router-dom';

export default function Home() {
	const [modalOpen, setModalOpen] = useState(false);
	const handleClose = () => setModalOpen(false);
	const handleAdd = () => {
		setModalOpen(true);
	}
	const navigate = useNavigate();

	const handleCreateBase = (e: FormEvent) => {
		e.preventDefault();
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);

		const entryData = Object.fromEntries(formData.entries());
		const { title, description } = entryData;

		const CREATE_BASE_MUT = gql`
			mutation createBase($title: String!, $priv: Boolean!, $desc: String!) {
				createBase(title: $title, priv: $priv, desc: $desc) {
					id
				}
			}
		`

		client.mutate({
			mutation: CREATE_BASE_MUT,
			variables: {
				title,
				desc: description,
				priv: entryData.private ? true : false
			},
			refetchQueries: [BASE_QUERY]
		}).then((result) => {
			console.log(result);
			const { data: {
				createBase: {
					id: baseId
				}
			} } = result;
			navigate(`/bases/${baseId}`);
		}).catch((error) => {
			console.error(error);
		})

		handleClose();
	}

	const BASE_QUERY = gql`
		query getBases {
			bases {
				id
				title
				dateCreated
				description
				owner {
					firstName
				}
			}
		}
	`

	const { loading, error, data } = useQuery(BASE_QUERY)

	if (loading) {
		return <CircularProgress />
	}

	if (error) {
		return (<div>Error...</div>);
	}

	return (
		<>
			<div className="bg-white py-24 sm:py-32">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl lg:mx-0">
						<h3 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Knowledge Base</h3>
						<p className="mt-2 text-lg leading-8 text-gray-600">
							Explore some of our public repositories of knowledge
						</p>
					</div>
				</div>
			</div>
			<div className="mb-4 w-fit ml-auto mx-4 bg-indigo-600 hover:bg-indigo-500 rounded px-4 py-1 text-white cursor-pointer font-light active:bg-indigo-400 transition-colors" onClick={handleAdd}>
				+ Add
			</div>

			<Dialog
				open={modalOpen}
				onClose={handleClose}>
				<div className="sm:mx-auto sm:w-full sm:max-w-sm p-12">
					<div className="text-center text-lg font-bold mb-6">
						Create a New Knowledge Base
					</div>
					<form className="space-y-6" onSubmit={handleCreateBase}>
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
							<label className="block text-sm font-medium leading-6 text-gray-900">
								Description
							</label>
							<div className="mt-2">
								<textarea
									id="description"
									name="description"
									required
									className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
								/>
							</div>
							<div className="flex self-center h-6 mt-4">
								<input type="checkbox" id="private" name="private" className="w-4 h-4 rounded checked:bg-indigo-600 text-indigo-600 focus:ring-indigo-600 align-middle my-auto accent-indigo-600"/>
								<label className="text-sm font-medium leading-6 text-gray-900 align-middle ml-1">
									Private?
								</label>
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

			<div className="mx-8 mb-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-8 lg:max-w-none lg:grid-cols-3">
				{
					data.bases.map((base: any) => {
						return (
							<Base key={base.id} base={base} />
						)
					})
				}
			</div>
		</>
	)
}


