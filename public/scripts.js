const ul = document.querySelector("ul");
const input = document.querySelector("input");
const form = document.querySelector("form");

/*

// Não se preocupem com esse pedaço de código comentado! Vamos descomentá-lo quando tivermos acabado de construir a API.

// Função que carrega o conteúdo da API.
async function load() {
    // fetch está como await para evitar que entre num esquema de promisse e só devolva o conteúdo após a iteração qua acontece em seguida.
    const res = await fetch('http://localhost:3000/')
        .then(data => data.json())
    // Iterando no vetor com o conteúdo (JSON) que está vindo da API e adicionando-os no frontend.
    res.urls.map(({name, url}) => addElement({name, url}))
}

load()
*/

function addElement({ name, url }) {
	// Pegando a lista da página principal
	const list = document.getElementById("favorites-list");

	// Criando os elementos HTML
	const li = document.createElement("li");
	const divInfo = document.createElement("div");
	const divRemove = document.createElement("div");
	const nameElement = document.createElement("p");
	const urlElement = document.createElement("p");

	// Adicionando conteúdo aos elementos HTML
	nameElement.innerText = name;
	urlElement.innerText = url;
	divRemove.innerText = "x";
	divInfo.classList.add("info");
	divRemove.classList.add("remove");

	// Anexando elementos
	divInfo.append(nameElement, urlElement);
	li.append(divInfo, divRemove);
	list.appendChild(li);
}

// Mock de dados
const links = [
	{ name: "Google", url: "https://google.com" },
	{ name: "Instagram", url: "https://instagram.com" },
	{ name: "Facebook", url: "https://facebook.com" },
];

// Iterando os links e adicionando no frontend
links.map(({ name, url }) => addElement({ name, url }));

const remove = document.querySelectorAll(".remove");

remove.forEach((item) => {
	item.addEventListener("click", () => {
        const li = item.parentNode;
        if (confirm("Tem certeza que deseja excluir este link?"));
		li.remove();
	});
});

form.addEventListener("submit", (event) => {
	event.preventDefault();

	let { value } = input;

	if (!value) return alert("Preencha o campo!");

	const [name, url] = value.split(",");

	if (!url) return alert("O texto não está formatado da maneira correta.");

	if (!/^http/.test(url)) return alert("Digite a url da maneira correta.");

	addElement({ name, url });

	input.value = "";
});
