var count = 0;
function mostraTexto(){
    const texto = document.getElementById("demo");
    if(count % 2 == 0){
        texto.textContent = `O jogo.`;
    } else{
        texto.textContent = `Perdeu.`
    }
    count++;
}

function mostraOgoat(){
    const molodoy = document.getElementById("goat");
    molodoy.src = "images/molodoy.jpg";
}