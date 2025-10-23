import{ produtos } from './produtos.js';

const secaoProdutos = document.getElementById('produtos');
produtos.forEach(produto => {
    const art = document.createElement(`article`);

    art.textContent = produto.title

    secaoProdutos.append(art)
})