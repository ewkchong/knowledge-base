import { Document } from './Document.js'
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne, BaseEntity } from "typeorm"
import { User } from './User.js'
import { MyContext } from 'src/context/Context.js'

@Entity()
export class Base extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string

	@CreateDateColumn()
	dateCreated: string

	@UpdateDateColumn()
	dateUpdated: string

	@Column()
	title: string

	@Column()
	thumbnail: string

	@ManyToOne(() => User, (user) => user.bases)
	owner: number

	@Column()
	priv: boolean

	@OneToMany(() => Document, (document) => document.base)
	documents: Document[]
}

export const baseTypeDef = `#graphql
	scalar URL
	scalar Date

	type Base {
		id: String!
		dateCreated: Date!
		title: String!
		thumbnail: URL
		owner: User!
		priv: Boolean!
		documents: [Document]
	}
`
export const baseResolver = {
	Base: {
		async documents() {
			//  TODO: implement documents, then return here
			return [];
		}
	},
	Mutation: {
		createBase(_: any, { title, priv }, ctx: MyContext) {
			if (!ctx.userId) {
				return false;
			}
			const base = new Base();
			base.title = title;
			base.priv = priv;
			base.owner = ctx.userId;
			
			try {
				Base.insert(base)
			} catch (error) {
				console.error(error)
				return false;
			}

			return true;
		}
	}
}
