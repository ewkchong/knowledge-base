import { User } from "../model/User.js";
import { AppDataSource } from "../data-source.js"
import { Base } from "../model/Base.js"
import { MyContext } from "src/context/Context.js";
import { GraphQLError } from "graphql";
import { Document } from "../model/Document.js";

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
		async base(_: any, { id }, ctx: MyContext): Promise<Base> {
			const result = await Base.findOne(
				{ 
					where: {
						id: id
					},
					relations: {
						owner: true
					}
				}
			);
			
			if (!result) {
				console.log("failed to find a base by id")
				throw new GraphQLError("could not find base with id")
			}
			
			if (result.priv && ctx.userId != result.owner.id) {
				console.log("someone tried to access a private base they don't own")
				throw new GraphQLError("could not find base with id")
			}

			return result;
		},
		async doc(_: any, { id }: any, __: MyContext) {
			const doc = await Document.findOne({
				where: {
					id: id
				}
			});

			return doc;
		},
		async isLinked(_: any, { doc1: id1, doc2: id2 }: any, __: MyContext): Promise<Boolean> {
			const docA = await Document.findOne({
				where: {
					id: id1
				},
				relations: {
					linked: true
				}
			});
			
			const docB = await Document.findOne({
				where: {
					id: id2
				},
				relations: {
					linked: true
				}
			});

			if (!docA || !docB) {
				throw new GraphQLError("one of the documents is non-existent");
			}

			const linkedWithId = (doc: Document, id: string): Boolean => {
				return doc.linked.some((ln: Document) => ln.id === id);
			}

			return (linkedWithId(docA, id2) || linkedWithId(docB, id1))
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
		},
		async currentUser(_: any, __: any, ctx: MyContext) {
			return ctx.userId ?? ""
		}
	}
}
