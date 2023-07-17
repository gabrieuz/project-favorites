const ul = document.querySelector("ul");
const input = document.querySelector("input");
const form = document.querySelector("form");

const host = `http://${window.location.hostname}:3000`;

// Função que carrega o conteúdo da API.
async function load() {
	const res = await fetch(host, {
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

searchInput.addEventListener("input", function () {
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
	setTimeout(() => {
		toast.remove();
	}, 3700);
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
		const nameElement = document.createElement("a");
		const divActions = document.createElement("div");
		const removeIcon = document.createElement("i");
		const updateIcon = document.createElement("i");

		// Adicionando conteúdo aos elementos HTML
		nameElement.innerText = `> ${item.name}`;
		removeIcon.innerText = "delete";
		divInfo.classList.add("info");
		divActions.classList.add("actions");
		removeIcon.classList.add("material-icons", "delete");
		updateIcon.classList.add("material-icons", "update");

		// Adicionando atributos aos elementos HTML
		nameElement.setAttribute("href", item.url);
		nameElement.setAttribute("target", "_blank");
		nameElement.id = item._id;
		updateIcon.innerText = "edit";
		removeIcon.title = "Remover";
		updateIcon.title = "Atualizar";

		// Anexando elementos
		divInfo.append(nameElement);
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
	const li = event.target.parentNode.parentNode;
	const listItem = li.querySelector(".info a");
	const actions = event.target.parentNode;
	const id = listItem.id;

	// Removendo os ícones de ações
	actions.remove();

	li.style.padding = "5px";

	const name = listItem.innerText.replace("> ", "");
	const url = listItem.href;

	// Removendo o href do elemento
	listItem.removeAttribute("href");

	showToast("Atualize o campo e clique em atualizar.", "info");

	//  Transformando o conteúdo do elemento em um input
	listItem.innerHTML = `<form class="form-update"><input id="${id}" type="text" value="${name}, ${url}"><button type="submit" class="update-button material-icons">save</button></form>`;

	// Pegando o input que foi criado
	const input = listItem.querySelector("input");

	// Adicionando o foco no input
	input.focus();

	// Adicionando evento de submit no form
	const form = listItem.querySelector(".form-update");

	form.addEventListener("submit", (event) => {
		event.preventDefault();

		// Pegando o novo valor do input
		const nameAndUrl = input.value;

		// Separando o valor do input em nome e url
		const name = nameAndUrl.split(",")[0];
		const url = nameAndUrl.split(",")[1];

		// Fazendo a requisição para a API para atualizar o elemento

		fetch(host + "/" + id, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ name, url }),
		})
			.then((response) => {
				if (!response.ok) throw new Error("Ocorreu um erro ao tentar atualizar.");
				load();
				showToast("Atualizado com sucesso.", "success");
			})
			.catch((error) => {
				showToast(error, "error");
			});
	});
}

update.forEach((item) => {
	item.addEventListener("click", updateElement);
});

const remove = document.querySelectorAll(".delete");

function removeElement(event) {
	if (confirm("Tem certeza que deseja deletar?")) {
		const listItem = event.target.parentNode.parentNode;
		const id = listItem.querySelector(".info a").id;

		// Fazendo a requisição para a API para deletar o elemento
		fetch(host + "/" + id, {
			method: "DELETE",
		})
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
	fetch(host, {
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

let menuIcon = document.getElementById("menu-icon");
let list = document.querySelector(".menu-items ul");
let menuStatus = false;

menuIcon.addEventListener("click", () => {
	if (menuStatus) {
		list.style.display = "none";
		menuStatus = false;
		menuIcon.innerText = "menu";
	} else {
		list.style.display = "block";
		menuStatus = true;
		menuIcon.innerText = "menu_open";
	}
});
