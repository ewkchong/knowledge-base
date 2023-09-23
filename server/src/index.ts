import 'dotenv/config';
import _ from 'lodash'
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import { AppDataSource } from './data-source';
import { baseResolver, baseTypeDef } from './model/Base';
import { documentResolver, documentTypeDef } from './model/Document';
import { userResolver, userTypeDef } from './model/User';
import { rootResolver } from './resolvers/RootResolver';
import { MyContext } from './context/Context';
import { checkAuth } from './auth/authUtils';
import cookieParser from 'cookie-parser';

const init = async () => {
	await AppDataSource.initialize()

	const queryRootTypeDef = `#graphql
		type Query {
			bases: [Base]
			base(id: String!): Base
			doc(id: String!): Document
			isLinked(doc1: String!, doc2: String!): Boolean
			users: [User]
			email(id: Int): String
			currentUser: String
		}
	`
	const app = express();
	const httpServer = http.createServer(app);

	const typeDefs = [queryRootTypeDef, baseTypeDef, documentTypeDef, userTypeDef];
	const resolvers = [rootResolver, baseResolver, documentResolver, userResolver]

	// Set up Apollo Server
	const server = new ApolloServer<MyContext>({
		typeDefs,
		resolvers: _.merge(resolvers),
		plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
	});

	await server.start()

	var corsOptions = {
		origin: 'http://localhost:5173',
		credentials: true // <-- REQUIRED backend setting
	};
	app.use(
		cors(corsOptions),
		bodyParser.json(),
		cookieParser(),
		expressMiddleware(server, {
			context: async ({ req, res }) => ({
				req: req,
				res: res,
				userId: checkAuth(req)
			}),
		}),
	);

	await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));
	console.log(`🚀 Server ready at http://localhost:4000`);
}

init().catch((err) => {
	console.error(err)
})
