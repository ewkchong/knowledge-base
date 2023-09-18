import React from 'react'
import { useNavigate } from 'react-router-dom';

const BackBar = ({nav}: any) => {
	const navigate = useNavigate();

	return (
		<header className="bg-white">
			<nav className="mx-auto flex items-center justify-between p-6 lg:px-8" aria-label="Global">
				<div className="lg:flex lg:flex-1 lg:justify-start">
					<a onClick={() => navigate(nav)} className="text-sm font-semibold leading-6 text-gray-900 cursor-pointer">
						<span aria-hidden="true">&larr;</span> Back
					</a>
				</div>
			</nav>
		</header>

	)
}

export default BackBar;
