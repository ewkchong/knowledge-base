import { BaseContext } from "@apollo/server";
import { Request, Response } from "express";
import { User } from "src/model/User";

export interface MyContext extends BaseContext {
	req?: Request,
	res?: Response,
	userId?: number
}
