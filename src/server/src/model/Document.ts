import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Base } from "./Base.js";

@Entity()
export class Document {
	@PrimaryGeneratedColumn("uuid")
	id: string

	@Column()
	title: string

	@Column()
	textData: string

	@ManyToOne(() => Base, (base) => base.documents)
	base: string

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

}
