import { gql, useMutation } from '@apollo/client'
import React from 'react'
import { Navigate } from 'react-router-dom'

const LOGOUT_MUT = gql`
	mutation logout {
		logout
	}
`

export default function Navbar() {
	const [logout, { client, data }] = useMutation(LOGOUT_MUT)

	if (data) {
		return <Navigate to="/" replace={true} />
	}

	function handleLogout() {
		logout().then(() => {
			client.resetStore()
		})
	}

	return (
		<header className="bg-white">
			<nav className="mx-auto flex items-center justify-end p-6 lg:px-8" aria-label="Global">
				{/*
				  <div className="flex lg:flex-1">
				  <a href="#" className="-m-1.5 p-1.5">
				  <span className="sr-only">Your Company</span>
				  <img className="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="" />
				  </a>
				  </div>
			  */}
				<div className="lg:flex lg:flex-1 lg:justify-end">
					<a onClick={handleLogout} className="text-sm font-semibold leading-6 text-gray-900 cursor-pointer">
						Log Out <span aria-hidden="true">&rarr;</span>
					</a>
				</div>
			</nav>
		</header>
	)
}

