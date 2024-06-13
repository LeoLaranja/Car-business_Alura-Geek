const carsList = document.querySelector("[data-lista]");

// FUNÇÃO ASSÍNCRONA PARA REQUISIÇÃO DE API VIA FETCH AWAIT
async function requisicaoApi() {
    let url = await fetch('http://localhost:3000/car');
    let urlConvertida = await url.json();
    return urlConvertida;
}

// FUNÇÃO PARA CONSTRUIR OS CARDS VIA INNERHTML, INSERINDO O TRECHO DE CÓDIGO DO HTML PRÉVIO. PASSAMOS PARAMETROS ESTABELECIDOS EM UM FOR EACH POSTERIOR
function constroiCards(id, name, valor, urlImg) {
    const card = document.createElement('div');
    card.className = 'poster';
    card.innerHTML = `
        <div class="post">
            <div class="post-item" data-id="${id}">
                <img src="${urlImg}" alt="">
                <p class="venda"><strong>${name}</strong></p>
                <p class="descricao-venda">R$ ${valor}</p>
                <a class="saibaMais" href="#"><button class="excluir-item">Excluir item</button></a>
            </div>
        </div>`;
    
    // Adiciona o event listener para o botão de exclusão
    card.querySelector('.excluir-item').addEventListener('click', async (event) => {
        event.preventDefault();
        await excluirItem(id, card);
    });

    return card;    
}

// FUNÇÃO PARA EXCLUIR UM ITEM
async function excluirItem(id, card) {
    const response = await fetch(`http://localhost:3000/car/${id}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        // Remove o card da interface
        card.remove();
    } else {
        console.error('Erro ao excluir o item');
    }
}

// FOR EACH PARA RODAR OS ELEMENTOS DO ARRAY DE VIDEOS DO ARQUIVO JSON (ID, NAME, VALOR, urlImg)
async function forEachApi() {
    const listaApi = await requisicaoApi();
    listaApi.forEach(element => {
        carsList.appendChild(constroiCards(element.id, element.name, element.valor, element.urlImg));
    });
}

forEachApi();

// FUNÇÃO QUE PERMITE ACRESCENTAR NOVOS VÍDEOS NA TELA ATRAVÉS DO FORMULÁRIO ACESSÍVEL VIA BOTÃO 'ENVIAR'.
async function criaVideo(name, valor, urlImg) {
    const conexao = await fetch("http://localhost:3000/car", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            valor: valor,
            urlImg: urlImg,
        })
    });

    const conexaoConvertida = conexao.json();
    return conexaoConvertida;
}

// ABAIXO FAREMOS O FORMULÁRIO FUNCIONAR PARA SER POSSÍVEL UM USUÁRIO CADASTRAR UM NOVO VÍDEO. PARA ISSO SELECIONAREMOS OS CAMPOS DO FORMULÁRIO E CRIAREMOS A FUNÇÃO PARA SUBMETER OS VIDEOS. ESSES SERÃO INCORPORADOS NA API.
const formulario = document.querySelector("[data-formulario]");

async function criarVideo(evento) {
    evento.preventDefault();

    const name = document.querySelector("[data-name]").value;
    const valor = document.querySelector("[data-valor]").value;
    const imagem = document.querySelector("[data-urlImg]").value;
   
    await criaVideo(name, valor, imagem);
    window.location.href = "../Pages/envioConcluido.html";
}

if (formulario) {
    formulario.addEventListener("submit", criarVideo);
}
