import "reflect-metadata"
import { DataSource } from "typeorm"
import { Base } from "./model/Base.js"
import { Document } from "./model/Document.js"
import { User } from "./model/User.js"
import 'dotenv/config.js'
import * as fs from 'fs'

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_NAME,
    synchronize: true,
    logging: true,
    entities: [Base, Document, User],
	// ssl: {
	// 	ca: fs.readFileSync(process.env.SSL_CERT_PATH).toString()
	// },
    subscribers: [],
    migrations: [],
})

