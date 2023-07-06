const http = require("http");
const data = require("./urls.json");
const URL = require("url");
const fs = require("fs");
const path = require("path");

http.createServer((req, res) => {

	res.writeHead(200, {
		"Access-Control-Allow-Origin": "*",
	});

	const { name, url, del } = URL.parse(req.url, true).query;
	if (!name || !url)
		return res.end(JSON.stringify(data));
	if (del) {
		data.urls = data.urls.filter((item) => item.url != url);
		return writeFile((message) => res.end(message));
	}

    if(name&&url)
        data.urls.push({ name, url });
    
    return writeFile(message => res.end(message))
}).listen(3000, () => console.log("Servidor rodando em: http://localhost:3000"));

function writeFile(cb) {
	fs.writeFile(path.join(__dirname, "urls.json"), JSON.stringify(data, null, 2), (err) => {
		if (err) throw err;
		cb("Operação realizada com sucesso!");
	});
}
