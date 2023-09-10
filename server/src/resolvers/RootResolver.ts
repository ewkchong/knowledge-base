import { User } from "../model/User.js";
import { AppDataSource } from "../data-source.js"
import { Base } from "../model/Base.js"
import { MyContext } from "src/context/Context.js";

export const rootResolver = {
	Query: {
		async bases(_: any, __: any, ctx: MyContext): Promise<Base[]> {
			const baseRepo = AppDataSource.getRepository(Base)

			const bases: Base[] = await baseRepo.find({
				relations: {
					owner: true
				}
			})
			
			const results: Base[] = []

			for (const base of bases) {
				if (base.priv && base.owner.id != ctx.userId) {
					continue;
				}
				results.push(base)
			}
			
			return results;
		},
		users(): Promise<User[]> {
			const userRepo = AppDataSource.getRepository(User)
			return userRepo.find()
		},
		async email(_: any, { id }, ctx: MyContext): Promise<string> {
			if (ctx.userId === undefined || ctx.userId == -1) {
				return ""
			}

			if (ctx.userId != id) {
				return ""
			}

			const user: User = await User.findOneBy({ id: id });

			return user.email;
		}
	}
}
