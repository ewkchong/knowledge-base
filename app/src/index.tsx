import { ApolloClient, ApolloProvider, createHttpLink, gql, InMemoryCache } from '@apollo/client';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { createHashRouter, redirect, RouterProvider } from 'react-router-dom';
import App from './components/App';
import BasePage, { loader as baseLoader } from './components/BasePage';
import DocPage, { loader as docLoader } from './components/DocPage';
import ErrorPage from './components/ErrorPage';
import Login from './components/Login';

const link = createHttpLink({
	uri: 'http://localhost:4000',
	credentials: 'include'
});

export const client = new ApolloClient({
	uri: 'http://localhost:4000',
	cache: new InMemoryCache(),
	link
});

async function checkUser(): Promise<any> {
	const USER_QUERY = gql`
		query currentUser {
			currentUser
		}
		`

	const result = await client.query({
		query: USER_QUERY
	})

	console.log(result)

	if (result.data.currentUser == "-1") {
		return redirect("/login")
	}

	return {};
}

async function checkAlready(): Promise<any> {
	const USER_QUERY = gql`
		query currentUser {
			currentUser
		}
		`

	const result = await client.query({
		query: USER_QUERY
	})

	if (result.data.currentUser != "-1") {
		return redirect("/")
	}

	return {}
}

const router = createHashRouter([
	{
		path: "/",
		element: <App />,
		loader: checkUser,
		errorElement: <ErrorPage />,
	},
	{
		path: "login",
		element: <Login />,
		loader: checkAlready,
		errorElement: <ErrorPage />
	},
	{
		path: "bases/:baseId",
		element: <BasePage />,
		errorElement: <ErrorPage />,
		loader: baseLoader,
	},
	{
		path: "bases/:baseId/:docId",
		element: <DocPage />,
		errorElement: <ErrorPage />,
		loader: docLoader,
	}
]);

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

root.render(
	<ApolloProvider client={client}>
		<RouterProvider router={router} />
	</ApolloProvider>
);


