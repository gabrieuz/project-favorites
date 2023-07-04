const http = require("http");
const fs = require("fs");
const path = require("path");

http.createServer((req, res) => {
	const file = req.url === "/" ? "index.html" : req.url;
	const pathFile = path.join(__dirname, "public", file);
	console.log(file);
	console.log(pathFile);

	// res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
	const extname = path.extname(pathFile);
	const allowedFileTypes = [".html", ".css", ".js"];
	const allowed = allowedFileTypes.find((item) => {
		item == extname;
	});

	if (!allowed) return;

	fs.readFile(pathFile),
		(err, data) => {
			if (err) throw err;
			res.end(data);
		};
}).listen(5000, () => {
	console.log("Servidor rodando...");
});
