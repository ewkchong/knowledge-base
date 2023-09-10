import React from 'react'
import { Box } from "@mui/system"
import { useState } from "react"

export default function Home() {
	const [posts, setPosts] = useState([])
	
	return (
		<Box>
		{ posts.map((post) => {
			return (<div>{post}</div>)
			})
		}
		</Box>
	)
}
