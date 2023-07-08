const express = require("express");
const app = express();
app.listen(3000, () => console.log("Servidor rodando em: http://localhost:3000"));

app.use(express.json())
const MongoClient = require("mongodb").MongoClient;

MongoClient.connect("mongodb://localhost:27017/favorites", (err, client) => {
	if (err) throw err;

	const db = client.db("items");

	db.collection("items")
		.find()
		.toArray((err, result) => {
			if (err) throw err;

			console.log(result);
		});
});

// app.get("/", (req, res) => {
// 	res.json({message: "express!"})
// });
