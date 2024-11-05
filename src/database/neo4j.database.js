const neo4j = require("neo4j-driver");
const dotenv = require('dotenv')

dotenv.config()

const NEO4J_URL = process.env.NEO4J_URL

const driver = neo4j.driver(
    NEO4J_URL,
    neo4j.auth.basic('neo4j', 'neo4j')
);

module.exports = driver