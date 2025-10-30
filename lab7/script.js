const urlP = 'https://deisishop.pythonanywhere.com/products';
const urlC = 'https://deisishop.pythonanywhere.com/categories';

const secaoProdutos = document.getElementById('produtos');
const secaoCesto = document.getElementById('cesto');

const valorTotalP = document.querySelector('#vlr')

let produtos = []
let valorTotal = 0.0;



function carregarProdutos(){
    fetch(urlP)
        .then(response => response.json())
        .then(data => {  
            produtos = data;
            carregarLocalStorage();
        })
        .catch(error => console.error('Erro:', error));
}

function attCesto() {
    if (valorTotalP){
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

function carregarLocalStorage(){
    secaoProdutos.innerHTML = '';
    secaoCesto.innerHTML = '';
    
    const produtosNoCesto = JSON.parse(localStorage.getItem('cesto')) || [];
    const valorCesto = parseFloat(localStorage.getItem('valor') || 0.0);

    valorTotal = valorCesto;
    attCesto();

    if(!produtos || produtos.length === 0){
        console.log('Nenhum produto carregado')
        return;
    }

    produtos.forEach(produto => {
        const art = criarProduto(produto);
        if(produtosNoCesto.includes(String(produto.id))){
            secaoCesto.appendChild(art);
            art.querySelector('button').textContent = '- Remover do Cesto';
        } else {
            secaoProdutos.appendChild(art);
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
        if(art.parentElement != secaoCesto) {
            secaoCesto.appendChild(art);
            btn.textContent = "- Remover do Cesto"
            btn.className = "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded";
            valorTotal += produto.price;
        } else {
            secaoProdutos.appendChild(art);
            btn.textContent = "+ Adicionar ao Cesto"
            btn.className = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";
            valorTotal -= produto.price;
        }
        attCesto();
        guardarCestoLocalStorage();
    })

    return art;
}

document.addEventListener('DOMContentLoaded', function() {
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
    
    // INICIA a aplicação
    carregarProdutos(); 
});


