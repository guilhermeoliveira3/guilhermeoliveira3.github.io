
import{ produtos } from './produtos.js';

const secaoProdutos = document.getElementById('produtos');
const secaoCesto = document.getElementById('cesto');
const valorTotalP = document.querySelector('#secC #vlr')
let valorTotal = 0.0;
valorTotalP.textContent = `${valorTotal}€`

function attCesto() {
    valorTotalP.textContent = `${valorTotal.toFixed(2)}€`
}

function guardarCestoLocalStorage() {
    const itensNoCesto = [];
    secaoCesto.querySelectorAll('article').forEach(produto => {
        itensNoCesto.push(String(produto.id));
    })
    localStorage.setItem('cesto', JSON.stringify(itensNoCesto));
    localStorage.setItem('valor', valorTotal);

}

function carregarLocalStorage(){
    secaoProdutos.innerHTML = '';
    secaoCesto.innerHTML = '';
    
    const produtosNoCesto = JSON.parse(localStorage.getItem('cesto')) || [];
    const valorCesto = parseFloat(localStorage.getItem('valor') || 0.0);

    valorTotal = valorCesto;
    attCesto();

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
    const art = document.createElement(`article`);
    art.id = produto.id;

    const title = document.createElement("h3");
    title.textContent = produto.title
    art.appendChild(title);

    const im = document.createElement("img");
    im.src = produto.image;
    art.appendChild(im);

    const valor = document.createElement("p");
    valor.textContent = `Custo total: ${produto.price}€`
    valor.style.fontWeight = "bold";
    art.appendChild(valor);

    const desc = document.createElement("p");
    desc.textContent = produto.description;
    desc.style.fontStyle ="italic"
    desc.style.whiteSpace = "normal";   
    desc.style.wordBreak = "break-word";
    desc.style.margin = "8px 0";
    art.appendChild(desc);

    const btn = document.createElement("button")
    btn.textContent = `+ Adicionar ao Cesto`
    art.appendChild(btn);

    btn.addEventListener("click", () => {
        if(art.parentElement != secaoCesto) {
            secaoCesto.appendChild(art);
            btn.textContent = "- Remover do Cesto"
            valorTotal += produto.price;
        } else {
            secaoProdutos.appendChild(art);
            btn.textContent = "+ Adicionar ao Cesto"
            valorTotal -= produto.price;
        }
        attCesto();
        guardarCestoLocalStorage();
    })


    return art;
}

carregarLocalStorage();

document.getElementById('limparCesto').addEventListener('click', () => {
    localStorage.removeItem('cesto');
    localStorage.removeItem('valor');
    valorTotal = 0;
    attCesto();
    secaoCesto.innerHTML = '';
    carregarLocalStorage(); // recarrega a lista vazia
});