const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
app.listen(process.env.PORT || 3000, () => console.log(`Server is running on http://localhost:${process.env.PORT}`));

app.use(express.json());
app.use(cors());

const { MongoClient, ObjectId } = require("mongodb");


async function run() {
	const client = new MongoClient(process.env.MONGODB_URI);
	await client.connect();

	const database = client.db(process.env.DB_NAME);
	const collection = database.collection("urls");

	app.get("/", async (req, res) => {
		const urls = await collection.find({}).toArray();
		return res.json(urls);
	});

	app.post("/", async (req, res) => {
		const { name, url } = req.body;

		if (!name || !url) {
			return res.status(400).json({
				message: "Name and url are required!",
			});
		}

		const obj = { name, url };

		const result = await collection.insertOne(obj);

		return res.json(result);
	});

	app.put("/:id", async (req, res) => {
		const { id } = req.params;
		const objectId = new ObjectId(id);
		const { name, url } = req.body;

		if (!name || !url) {
			return res.status(400).json({
				message: "Name and url are required!",
			});
		}

		const obj = { name, url };

		const result = await collection.findOneAndUpdate({ _id: objectId }, { $set: obj }, { returnOriginal: false });

		return res.json(result);
	});

	app.delete("/:id", async (req, res) => {
		const { id } = req.params;

		const objectId = new ObjectId(id);

		const result = await collection.deleteOne({ _id: objectId });

		if (result.deletedCount === 0) {
			return res.status(400).json({
				message: "Não foi possível deletar o item.",
			});
		}

		return res.status(204).send();
	});
}

run().catch(console.dir);
