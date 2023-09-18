import { BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { MyContext } from "src/context/Context.js";
import { Base } from "./Base.js";
import { GraphQLError } from "graphql";

@Entity()
export class Document extends BaseEntity {

	@PrimaryGeneratedColumn("uuid")
	id: string

	@Column()
	title: string

	@Column({
		nullable: true
	})
	textData: string

	@ManyToOne(() => Base, (base) => base.documents)
	base: Base

	@ManyToMany(() => Document, (document) => document.linked)
	@JoinTable()
	linked: Document[]
}

export const documentTypeDef = `#graphql
	type Document {
		id: String!
		title: String!
		textData: String
		linked: [Document]
	}

	type Mutation {
		linkDoc(srcDoc: String!, tgtDoc: String!): Boolean
		updateText(doc: String!, textData: String!): Boolean
	}
`

export const documentResolver = {
	Document: {
		async linked(parent: any) {
			const doc = await Document.findOne({
				where: {
					id: parent.id
				},
				relations: {
					linked: true
				}
			});

			return doc.linked;
		}
	},
	Mutation: {
		async linkDoc(_: any, args: { srcDoc: string, tgtDoc: string }, ctx: MyContext): Promise<Boolean> {
			const srcDoc = await Document.findOne({
				where: {
					id: args.srcDoc
				},
				relations: {
					linked: true
				}
			});
			const tgtDoc = await Document.findOne({
				where: {
					id: args.tgtDoc
				},
				relations: {
					linked: true
				}
			});

			if (!srcDoc) {
				throw new GraphQLError('Could not find doc1', {
					extensions: {
						code: 'DOCUMENT_NOT_FOUND',
						argumentName: 'srcDoc'
					}
				})
			} else if (!tgtDoc) {
				throw new GraphQLError('Could not find doc2', {
					extensions: {
						code: 'DOCUMENT_NOT_FOUND',
						argumentName: 'tgtDoc'
					}
				})
			}

			srcDoc.linked.push(tgtDoc);

			try {
				await srcDoc.save()
			} catch (error) {
				console.error(error);
				throw new GraphQLError("could not link documents", {
					extensions: {
						code: 'INTERNAL_SERVER_ERROR'
					}
				})
			}

			return true;
		},
		async updateText(_: any, { doc, textData } , ctx: MyContext): Promise<Boolean> {
			// TODO: test
			const docu = await Document.findOneBy({ id: doc });
			if (!docu) {
				throw new GraphQLError("document not found", {
					extensions: {
						code: 'DOCUMENT_NOT_FOUND'
					}
				})
			}

			docu.textData = textData;
			try {
				await docu.save()	
			} catch (error) {
				throw new GraphQLError("could not save document", {
					extensions: {
						code: 'INTERNAL_SERVER_ERROR',
						argumentName: doc
					}
				})
			}

			return true;
		}
	}
}
