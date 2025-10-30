const urlP = 'https://deisishop.pythonanywhere.com/products';
const urlC = 'https://deisishop.pythonanywhere.com/categories';

const secaoProdutos = document.getElementById('produtos');
const secaoCesto = document.getElementById('cesto');

const valorTotalP = document.querySelector('#vlr')

let produtos = []
let produtosFiltrados = []
let valorTotal = 0.0;
let categorias = []

const filtros = {
    pesquisa: '',
    categoria: 'Todas as categorias',
    ordenacao: 'nome'
}


function carregarProdutos() {
    fetch(urlP)
        .then(response => response.json())
        .then(data => {
            produtos = data;
            produtosFiltrados = [...produtos]
            carregarCategorias();
            carregarLocalStorage();
        })
        .catch(error => console.error('Erro:', error));
}

function carregarCategorias(){
    fetch(urlC)
        .then(response => response.json())
        .then(data => categorias = data)
        .catch(error => console.error('Erro:', error));
}

function aplicarFiltros(){
    let produtosTemp = [...produtos];

    if(filtros.pesquisa) {
        produtosTemp = produtosTemp.filter(produto =>
            //se o nome do produto tiver a pesquisa(mesmo que uma parte apenas) - case insensitive
            produto.title.toLowerCase().includes(filtros.pesquisa.toLowerCase())
        );
    }

    if(filtros.categoria && filtros.categoria !== 'Todas as categorias'){
        produtosTemp = produtosTemp.filter(produto =>
            produto.category === filtros.categoria
        );
    }

    produtosTemp = ordenarProdutos(produtosTemp, filtros.ordenacao);

    produtosFiltrados = produtosTemp;
    renderizarProdutos();
}

function ordenarProdutos(arrayProdutos, crit){
    return arrayProdutos.sort((a,b) => {
        switch (crit) {
            case 'nome':
                return a.title.localeCompare(b.title);
            case 'preco':
                return a.price - b.price;
            case 'preco-desc':
                return b.price - a.price;
            default:
                return 0;
        }
    })
}

function renderizarProdutos() {
    secaoProdutos.innerHTML = '';

    produtosFiltrados.forEach(produto => {
        const art = criarProduto(produto);
        secaoProdutos.appendChild(art);
    });
}


function attCesto() {
    if (valorTotalP) {
        valorTotalP.textContent = `${valorTotal.toFixed(2)}€`
    }

}

function guardarCestoLocalStorage() {
    const itensNoCesto = [];
    secaoCesto.querySelectorAll('article').forEach(produto => {
        itensNoCesto.push(String(produto.id));
    })
    localStorage.setItem('cesto', JSON.stringify(itensNoCesto));
    localStorage.setItem('valor', valorTotal.toString());
}

function carregarLocalStorage() {
    secaoProdutos.innerHTML = '';
    secaoCesto.innerHTML = '';

    const produtosNoCesto = JSON.parse(localStorage.getItem('cesto')) || [];
    const valorCesto = parseFloat(localStorage.getItem('valor') || 0.0);

    valorTotal = valorCesto;
    attCesto();

    if (!produtos || produtos.length === 0) {
        console.log('Nenhum produto carregado')
        return;
    }

    aplicarFiltros();

    produtos.forEach(produto => {
        if (produtosNoCesto.includes(String(produto.id))) {
            const art = criarProduto(produto);
            secaoCesto.appendChild(art);
            art.querySelector('button').textContent = '- Remover do Cesto';
            art.querySelector('button').className = "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded";
        }
    })
}


function criarProduto(produto) {
    const art = document.createElement('article');
    art.id = produto.id;
    art.className = 'bg-white p-4 rounded-lg shadow-md flex flex-col w-full max-w-sm mx-auto';

    const title = document.createElement("h3");
    title.textContent = produto.title
    title.className = "font-bold text-lg mb-2 h-12 overflow-hidden";
    art.appendChild(title);

    const imageContainer = document.createElement("section");
    imageContainer.className = "h-48 flex items-center justify-center bg-gray-50 rounded-lg mb-2 p-2";

    const im = document.createElement("img");
    im.src = produto.image;
    im.className = "max-h-full max-w-full object-contain";

    imageContainer.appendChild(im);
    art.appendChild(imageContainer);

    const valor = document.createElement("p");
    valor.textContent = `Custo total: ${produto.price}€`
    valor.className = "font-bold text-green-600 mb-2";
    art.appendChild(valor);

    const desc = document.createElement("p");
    desc.textContent = produto.description;
    desc.className = "text-gray-600 text-sm mb-3";
    art.appendChild(desc);

    const btn = document.createElement("button")
    btn.textContent = `+ Adicionar ao Cesto`
    btn.className = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";
    art.appendChild(btn);

    btn.addEventListener("click", () => {
        if (art.parentElement != secaoCesto) {
            secaoCesto.appendChild(art);
            btn.textContent = "- Remover do Cesto"
            btn.className = "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded";
            valorTotal += produto.price;
        } else {
            if (produtosFiltrados.some(p => p.id === produto.id)){
                secaoProdutos.appendChild(art);
            }
            btn.textContent = "+ Adicionar ao Cesto"
            btn.className = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";
            valorTotal -= produto.price;
        }
        attCesto();
        guardarCestoLocalStorage();
    })

    return art;
}

function setupFiltros() {

    const inputPesquisa = document.getElementById('pesquisa');
    if (inputPesquisa) {
        inputPesquisa.addEventListener('input', (e) => {
            filtros.pesquisa = e.target.value;
            aplicarFiltros();
        });
    }

    const selectTipo = document.getElementById('tipo');
    if (selectTipo) {
        selectTipo.addEventListener('change', function() {
            filtros.categoria = this.value;
            aplicarFiltros();
        });
    }

    const selectOrdenacao = document.getElementById('order');
    if (selectOrdenacao) {
        selectOrdenacao.addEventListener('change', function() {
            switch(this.value) {
                case 'Preço Crescente':
                    filtros.ordenacao = 'preco';
                    break;
                case 'Preço Decrescente':
                    filtros.ordenacao = 'preco-desc';
                    break;
                case 'Ordenar pelo preço':
                default:
                    filtros.ordenacao = 'nome';
                    break;
            }
            aplicarFiltros();
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const limparCestoBtn = document.getElementById('limparCesto');
    if (limparCestoBtn) {
        limparCestoBtn.addEventListener('click', () => {
            localStorage.removeItem('cesto');
            localStorage.removeItem('valor');
            valorTotal = 0;
            attCesto();
            if (secaoCesto) {
                secaoCesto.innerHTML = '';
            }
            carregarLocalStorage();
        });
    }

    setupFiltros();

    // INICIA a aplicação
    carregarProdutos();
});






