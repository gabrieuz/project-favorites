const http = require("http");
const fs = require("fs");
const path = require("path");

http.createServer((req, res) => {
	res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
	if (req.url === "/") {
		fs.readFile(path.join(__dirname, "public", "index.html"), (err, data) => {
			if (err) throw err;
			res.end(data);
		});
	}
}).listen(5000, () => {
	console.log("Servidor rodando...");
});
