const http = require("http");
const fs = require("fs");
const path = require("path");

http.createServer((req, res) => {
	const file = req.url === "/" ? "index.html" : req.url;
	const pathFile = path.join(__dirname, "public", file);

	const extname = path.extname(pathFile);
	const allowedFileTypes = [".html", ".css", ".js", ".ico", ".svg"];
	const allowed = allowedFileTypes.find((item) => item == extname);

	if (!allowed) return;

	fs.readFile(pathFile,
		(err, data) => {
			if (err) throw err;
			res.end(data);
		});
}).listen(5000, () => {
	console.log("Servidor rodando em http://localhost:5000");
});
