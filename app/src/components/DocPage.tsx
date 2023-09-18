import { gql, useQuery } from "@apollo/client";
import { CircularProgress } from "@mui/material";
import React from "react";
import { useLoaderData } from "react-router-dom";

export async function loader({ params }: any) {
	return params.docId;
}

const DocPage = () => {
	const docId = useLoaderData();

	const DOC_QUERY = gql`
		query getDoc {
			doc(id: "${docId}") {
				id
				title
				textData
			}
		}
		`

	const { loading, error, data } = useQuery(DOC_QUERY)

	if (loading) return <CircularProgress />;
	if (error) return <>Error!!</>

	const { id, title, textData } = data.doc;
	console.log(data);

	return (
		<div>
			{id}
			{title}
			{textData}
		</div>
	)
}

export default DocPage;
