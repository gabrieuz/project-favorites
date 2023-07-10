const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
app.listen(process.env.PORT || 3000, () => console.log(`Server is running on http://localhost:${process.env.PORT}`));

app.use(express.json());
app.use(cors());

const { MongoClient } = require("mongodb");

async function run() {
	const client = new MongoClient(process.env.MONGODB_URI);
	await client.connect();

	const database = client.db(process.env.DB_NAME);
	const collection = database.collection("urls");

	app.get("/", async (req, res) => {
		const urls = await collection.find({}).toArray();
		return res.json(urls);
	});
}

run().catch(console.dir);

