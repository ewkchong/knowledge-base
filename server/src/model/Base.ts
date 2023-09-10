import { Document } from './Document.js'
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne, BaseEntity } from "typeorm"
import { User } from './User.js'
import { MyContext } from 'src/context/Context.js'
import { GraphQLError } from 'graphql'
import { AppDataSource } from '../data-source.js'

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

	@Column({
		nullable: true
	})
	thumbnail: string

	@ManyToOne(() => User, (user) => user.bases)
	owner: User

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
		async documents(parent: Base) {
			console.log("parentid: ", parent.id)
			const docs = AppDataSource.getRepository(Document)
			const results = await docs.findBy({
				base: {
					id: parent.id
				}
			})

			return results;
		}
	},
	Mutation: {
		async addDocToBase(_: any, args: { baseId: string, title: string }, ctx: MyContext): Promise<Boolean> {
			if (!ctx.userId) {
				throw new GraphQLError("you must be logged in to create a document")
			}

			const base: Base = await Base.findOne({
				where: {
					id: args.baseId
				},
				relations: {
					owner: true,
					documents: true
				}
			});

			if (base.priv && base.owner.id !== ctx.userId) {
				throw new GraphQLError("you must be the owner of the base to create a document in a private base")
			}

			const doc = new Document();
			doc.title = args.title;
			doc.base = base;
			doc.save();

			base.documents.push(doc);
			await base.save()

			return true;

		},
	}
}
