import 'dotenv/config'
import { Request } from 'express'
import { sign, verify } from 'jsonwebtoken'

export function generateAccessKey(userid: number): string {
	return sign({ userId: userid }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "7d" })
}

export function checkAuth(req: Request): number {
	const token = req.cookies?.jwtok

	try {
		const payload = verify(token, process.env.ACCESS_TOKEN_SECRET) as any;
		return payload.userId;
	} catch (error) {
		console.error("failed to verify token")
		return -1;
	}
}


