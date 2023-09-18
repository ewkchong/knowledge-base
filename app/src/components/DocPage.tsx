import { gql } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import { useLoaderData } from "react-router-dom";
import BackBar from "./BackBar";
import { parse } from 'marked';
import DOMPurify from 'dompurify';
import './DocPage.css'
import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { client } from "..";

export async function loader({ params }: any) {
	return params;
}

const DocPage = () => {
	//  NOTE: Requires properties docId and baseId
	const params: any = useLoaderData();
	const [title, setTitle] = useState("")
	const [editMode, setEditMode] = useState(false);
	const docData = useRef({ text: "", id: "", title: "" });

	const onChange = React.useCallback((value: any, _: any) => {
		docData.current.text = value;
		console.log(docData.current.text);
	}, []);

	const handleToggle = () => {
		setEditMode(!editMode);
	}

	const DOC_QUERY = gql`
		query getDoc {
			doc(id: "${params.docId}") {
				id
				title
				textData
			}
		}
		`;



	useEffect(() => {
		client.query({
			query: DOC_QUERY,
		}).then((result) => {
			const { data } = result;
			const { title, textData } = data.doc;
			setTitle(title)
			docData.current.text = textData;
		})

		return () => {
			console.log(String.raw`${docData.current.text}`)
			const SAVE_MUT = gql`
				mutation updateText($textData: String!) {
					updateText(doc: \"${params.docId}\", textData: $textData){
						id
						textData
					}
				}
				`;
			client.mutate({
				mutation: SAVE_MUT,
				variables: {
					textData: docData.current.text
				}
			}).then((result) => {
				console.log(result);
			}).catch(error => {
				console.error(error);
			})
		}
	}, [])

	return (
		<>
			<BackBar nav={`/bases/${params.baseId}`} />
			<div className="bg-white py-24 sm:py-32">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl lg:mx-0">
						<h3 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{title}</h3>
					</div>
					<div className="ml-auto bg-indigo-600 hover:bg-indigo-500 shadow-md text-sm text-white w-fit px-6 py-1 rounded cursor-pointer" onClick={handleToggle}>{ editMode ? "View" : "Edit"}</div>
				</div>
				<div className="mx-10 mt-2 pt-8 border-t border-t-gray-200">
					{editMode ?
						<CodeMirror
							value={docData.current.text}
							extensions={[markdown({ base: markdownLanguage, codeLanguages: languages })]}
							onChange={onChange}
						/>
						:
						<div id="mdDisplay" dangerouslySetInnerHTML={{ __html: DOMPurify(window).sanitize(parse(docData.current.text)) }}></div>
					}
				</div>
			</div>
		</>
	)
}

export default DocPage;
