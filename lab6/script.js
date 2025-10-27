
import{ produtos } from './produtos.js';

const secaoProdutos = document.getElementById('produtos');
const secaoCesto = document.getElementById('cesto');
const valorTotalP = document.querySelector('#secC #vlr')
let valorTotal = 0.0;

valorTotalP.textContent += `${valorTotal.toFixed(2)}€`
produtos.forEach(produto => {
    const art = document.createElement(`article`);

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
    })

    

    secaoProdutos.append(art)
})
