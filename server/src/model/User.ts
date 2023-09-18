import { AppDataSource } from "../data-source";
import { MyContext } from "src/context/Context";
import { hash, compare } from "bcryptjs"
import { GraphQLError } from "graphql";
import { generateAccessKey } from "../auth/authUtils.js";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Base } from "./Base";

@Entity()
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	firstName: string

	@Column()
	lastName: string

	@Column("text", {
		nullable: true
	})
	bio: string

	@Column({
		nullable: true
	})
	avatar: string

	@Column()
	email: string

	@Column()
	password: string

	@OneToMany(() => Base, (base) => base.owner)
	bases: Base[]
}

export const userTypeDef = `#graphql
	scalar URL

	type LoginResponse {
		ok: Boolean!
		accessToken: String
	}

	type User {
		id: String!
		email: String
		firstName: String!
		lastName: String!
		bio: String
		avatar: URL
	}
	
	type Mutation {
		createBase(title: String!, priv: Boolean!, desc: String!): Boolean
		register(email: String!, password: String!, firstName: String!, lastName: String!): Boolean
		login(email: String!, password: String!): LoginResponse
		logout: Boolean
	}
`

export const userResolver = {
	User: {},
	Mutation: {
		async register(_: any, { email, password, firstName, lastName }): Promise<Boolean> {
			try {
				const hashedPass: string = await hash(password, 10)

				await User.insert({
					email,
					password: hashedPass,
					firstName,
					lastName
				})
			} catch(err) {
				console.error(err)
				return false;
			}
			return true;
		},
		async login(_: any, { email, password }, ctx: MyContext) {
			const user = await User.findOneBy({ email: email })

			console.log("email: ", email);

			if (!user) {
				throw new GraphQLError("user not found")
			}

			const comp: Boolean = await compare(password, user.password)
			if (!comp) {
				throw new GraphQLError("incorrect password")
			}

			const accessToken = generateAccessKey(user.id);

			if (ctx.res) {
				ctx.res.cookie("jwtok", accessToken, {
					httpOnly: false
				})	
			}

			return { ok: true, accessToken };
		},
		async logout(_: any, __: any, ctx: MyContext): Promise<Boolean> {
			try {
				ctx.res.clearCookie("jwtok")
				console.log(`user ${ctx.userId} has been logged out`)
				return true;
			} catch (error) {
				console.log(error);
				return false;
			}
		},
		async createBase(_: any, { title, priv, desc }, ctx: MyContext) {
			if (ctx.userId === undefined || ctx.userId == -1) {
				return false;
			}

			const base = new Base();
			base.title = title;
			base.priv = priv;
			base.description = desc ?? "";
			
			try {
				console.log("user ID: ", ctx.userId)
				base.owner = await User.findOneBy({id: ctx.userId});
				console.log("owner: ", base.owner)
				Base.insert(base)
			} catch (error) {
				console.error(error)
				return false;
			}

			return true;
		},
	}
}
