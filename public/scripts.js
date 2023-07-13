const ul = document.querySelector("ul");
const input = document.querySelector("input");
const form = document.querySelector("form");

// Não se preocupem com esse pedaço de código comentado! Vamos descomentá-lo quando tivermos acabado de construir a API.

// Função que carrega o conteúdo da API.
async function load() {
	const res = await fetch("http://localhost:3000", {
		method: "GET",
	})
		.then((data) => data.json())
		.then((data) => {
			const searchInput = document.getElementById("search-input");
			const searchValue = searchInput.value.toLowerCase();

			const filteredData = data.filter((item) => {
				const name = item.name.toLowerCase();
				const url = item.url.toLowerCase();
				return name.includes(searchValue) || url.includes(searchValue);
			});

			listElements(filteredData);
		});
}

load();


// Função de busca por nome ou url.
const searchInput = document.getElementById("search-input");

searchInput.addEventListener("input", function() {
    load();
});

// Função que mostra o toast na tela.
function showToast(message, type) {
	const toast = document.getElementById("toast");
	toast.textContent = message;
	toast.classList.add("show");

	// Remover classes de estilo anteriores
	toast.classList.remove("error", "success", "info");

	// Adicionar classe de estilo com base no tipo
	if (type === "error") {
		toast.classList.add("error");
	} else if (type === "success") {
		toast.classList.add("success");
	} else if (type === "info") {
		toast.classList.add("info");
	}

	setTimeout(() => {
		toast.classList.remove("show");
	}, 2700);
}

// Função que adiciona os elementos no frontend.
function listElements(data) {
	// Pegando a lista da página principal
	const list = document.getElementById("favorites-list");

	list.innerHTML = "";

	// Iterando no vetor com o conteúdo (JSON) que está vindo da API e adicionando-os no frontend.
	data.forEach((item) => {
		// Criando os elementos HTML
		const li = document.createElement("li");
		const divInfo = document.createElement("div");
		const nameElement = document.createElement("p");
		const urlElement = document.createElement("a");
		const divActions = document.createElement("div");
		const removeIcon = document.createElement("i");
		const updateIcon = document.createElement("i");

		// Adicionando conteúdo aos elementos HTML
		nameElement.innerText = item.name;
		urlElement.innerText = item.url;
		removeIcon.innerText = "delete";
		divInfo.classList.add("info");
		divActions.classList.add("actions");
		removeIcon.classList.add("material-icons", "delete");
		updateIcon.classList.add("material-icons", "update");

		// Adicionando atributos aos elementos HTML
		urlElement.setAttribute("href", item.url);
		urlElement.setAttribute("target", "_blank");
		nameElement.id = item.name;
		urlElement.id = item.url;
		updateIcon.innerText = "edit";
		removeIcon.title = "Remover";
		updateIcon.title = "Atualizar";

		// Anexando elementos
		divInfo.append(nameElement, urlElement);
		divActions.append(updateIcon, removeIcon);
		li.append(divInfo, divActions);
		list.appendChild(li);

		// Adicionando evento de click para atualizar o elemento
		updateIcon.addEventListener("click", updateElement);
		// Adicionando evento de click para remover o elemento
		removeIcon.addEventListener("click", removeElement);
	});
}

const update = document.querySelectorAll(".update");

function updateElement(event) {
	const favoritesInput = document.getElementById("favorites-input");
	const favoritesButton = document.getElementById("favorites-button");
	const nameElement = event.target.parentNode.parentNode.querySelector(".info p");
	const urlElement = event.target.parentNode.parentNode.querySelector(".info a");

	const name = nameElement.id;
	const url = urlElement.id;

	favoritesButton.innerText = "Atualizar";

	favoritesInput.value = `${name},${url}`;

	showToast("Atualize o campo e clique em atualizar.", "info");

	// Removendo item antigo
	fetch(`http://localhost:3000/?name=${encodeURIComponent(name)}&url=${encodeURIComponent(url)}&del=1`)
		.then((response) => {
			if (!response.ok) throw new Error("Ocorreu um erro ao tentar atualizar.");
		})
		.catch((error) => console.error(error));

	favoritesButton.onclick = () => {
		favoritesButton.innerText = "Salvar";
	};
}

update.forEach((item) => {
	item.addEventListener("click", updateElement);
});

const remove = document.querySelectorAll(".delete");

function removeElement(event) {
	if (confirm("Tem certeza que deseja deletar?")) {
		const name = event.target.parentNode.parentNode.querySelector(".info p").id;
		const url = event.target.parentNode.parentNode.querySelector(".info a").innerText;

		console.log(name, url);

		// Fazendo a requisição para a API para deletar o elemento
		fetch(`http://localhost:3000/?name=${encodeURIComponent(name)}&url=${encodeURIComponent(url)}&del=1`)
			.then((response) => {
				if (!response.ok) throw new Error("Ocorreu um erro ao tentar deletar.");
				load();
				showToast("Deletado com sucesso!", "success");
			})
			.catch((error) => console.error(error));
	}
}

remove.forEach((item) => {
	item.addEventListener("click", removeElement);
});

function addElement(name, url) {
	// Fazendo a requisição para a API para cadastrar o novo elemento
	fetch(`http://localhost:3000/`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ name, url }),
	})
		.then((response) => {
			if (!response.ok) throw new Error("Ocorreu um erro ao tentar cadastrar.");
			load();
			input.value = "";
			showToast("Item salvo com sucesso!", "info");
		})
		.catch((error) => {
			console.error(error);
			showToast("Ocorreu um erro ao tentar cadastrar.", "error");
		});
}

form.addEventListener("submit", (event) => {
	event.preventDefault();

	let { value } = input;

	if (!value) return showToast("Preencha o campo.");

	const [name, url] = value.split(",");

	if (!url) return showToast("Formate o texto da maneira correta.");

	if (!/^http/.test(url)) return showToast("Digite a url da maneira correta.");

	addElement(name, url);
});
