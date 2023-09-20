docker run \
	--network knowledge-base --network-alias postgres \
	-v "/Users/eddie/Library/Application Support/Postgres/var-15":/var/lib/postgresql/data\
	-p 5432:5432 \
	--name test \
	-e POSTGRES_PASSWORD=test \
	-e POSTGRES_USER=eddie \
	-d postgres:15
