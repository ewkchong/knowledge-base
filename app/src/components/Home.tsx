import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { CircularProgress } from '@mui/material';
import Base from './Base';

export default function Home() {
	const handleAdd = () => {
		console.log("clicked Add")
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


