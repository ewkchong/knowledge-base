import { BaseEntity, Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
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
	linked: Document[]
}

export const documentTypeDef = `#graphql
	type Document {
		uuid: String!
		title: String!
		textData: String
		linked: [Document]
	}
`

export const documentResolver = {
	Mutation: {
		async linkDoc(_: any, args: { doc1: string, doc2: string }, ctx: MyContext): Promise<Boolean> {
			const doc1 = await Document.findOne({
				where: {
					id: args.doc1
				}
			});
			const doc2 = await Document.findOneBy({ id: args.doc2 });

			if (!doc1) {
				throw new GraphQLError('Could not find doc1', {
					extensions: {
						code: 'DOCUMENT_NOT_FOUND',
						argumentName: 'doc1'
					}
				})
			} else if (!doc2) {
				throw new GraphQLError('Could not find doc2', {
					extensions: {
						code: 'DOCUMENT_NOT_FOUND',
						argumentName: 'doc2'
					}
				})
			}

			doc1.linked.push(doc2);
			doc2.linked.push(doc1);

			try {
				await doc1.save()
				await doc2.save()
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
