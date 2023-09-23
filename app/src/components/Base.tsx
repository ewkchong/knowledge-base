import React from 'react'
import { Link } from 'react-router-dom';

export default function Base({ base }: any) {
	const formatDate = (date: string) => {
		return new Date(date).toLocaleDateString("en-us", { month: "short", day: "numeric", year: "numeric" });
	}

	return (
		<article key={base.id} className="flex p-4 max-w-xl flex-col items-start justify-between border border-gray-200 rounded-lg shadow hover:bg-gray-100">
		<Link to={`bases/${base.id}`}>
			<div className="flex items-center gap-x-4 text-xs">
				<time dateTime={base.dateCreated} className="text-gray-500">
					{formatDate(base.dateCreated) ?? ""}
				</time>
				{/*
				<div
					className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
				>
					Category
				</div>
				*/}
			</div>
			<div className="group relative">
				<h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
					<div>
						<span className="absolute inset-0" />
						{base.title}
					</div>
				</h3>
				<p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">{base.description ?? ""}</p>
			</div>
			<div className="relative mt-8 flex items-center gap-x-4">
				<img src={`https://api.dicebear.com/7.x/initials/svg?seed=${base.owner.firstName}`} alt="" className="h-10 w-10 rounded-full bg-gray-50" />
				<div className="text-sm leading-6">
					<div className="font-semibold text-gray-900">
						<div>
							<span className="absolute inset-0" />
							{base.owner.firstName}
						</div>
					</div>
					{/* <p className="text-gray-600">{base.author.role}</p>*/}
				</div>
			</div>
		</Link>
		</article>
	)
}
