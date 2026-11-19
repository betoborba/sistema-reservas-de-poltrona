const frm = document.querySelector("form");
const dvCabine = document.querySelector("#divCabine");
const campoPoltrona = document.querySelector("#inPoltrona");
const btConfirmar = document.querySelector("#btConfirmar");

const POLTRONAS = 72;
const reservadas = [];

window.addEventListener("load", () => {
    const ocupadas = localStorage.getItem("cabineOcupadas")
        ? localStorage.getItem("cabineOcupadas").split(";")
        : [];

       
    // Mantém o titulo e substitui somente a área dos assentos
    dvCabine.querySelector(".layout-cabine")?.remove();

    const layout = document.createElement("div");
    layout.className = "layout-cabine";

    const ladoEsquerdo = document.createElement("div");
    ladoEsquerdo.className = "lado-poltronas";

    const corredor = document.createElement("div")
    corredor.className = "corredor";

    const ladoDireito = document.createElement("div");
    ladoDireito.className = "lado-poltronas";

    layout.append(ladoEsquerdo, corredor, ladoDireito)
    dvCabine.appendChild(layout) 

    // Repetição para montar o número total de de poltronas definida na constante 
    for (let numero = 1; numero <= POLTRONAS; numero++) {
        const figure = document.createElement("figure");
        const imgStatus = document.createElement("img"); 
        const legenda = document.createElement("figcaption");

        imgStatus.className = "poltrona";
        imgStatus.dataset.poltrona = numero;

       imgStatus.src = ocupadas.includes(String(numero))
        ? "img/ocupada.png"
        : "img/disponivel.png";

        
        const zeros = numero < 10 ? "00" : numero < 100 ? "0" : "";
        legenda.textContent = `[${zeros}${numero}]`;

        figure.append(imgStatus, legenda);
        
        // A cada grupo de 8: quatro vão para cada lado
        const posicaoNaFileira = (numero - 1) % 4;

        if (posicaoNaFileira < 2) {
            ladoEsquerdo.appendChild(figure)
        } else {
            ladoDireito.appendChild(figure)
        }
    }
});

frm.addEventListener("submit", (e) => {
    e.preventDefault(); // evita o envio do form

    const poltrona = Number(campoPoltrona.value); // Obtém o conteúdo de inPoltrona
    // valida o preenchimento do campo de entrada...não pode ser maior constante de 70 poltronas
    if (poltrona > POLTRONAS) {
        alert("informe um número de poltrona válido")
        frm.inPoltrona.focus();
        return
    }

    const ocupadas = localStorage.getItem("cabineOcupadas")
    ? localStorage.getItem("cabineOcupadas").split(";")
    :[];

    // se poltrona escolhida já está ocupada (exite em localStorage) é utilizado toString pq localStore armazena em string
    if (ocupadas.includes(poltrona.toString())){
        alert(`Poltrona ${poltrona} já ocupada...`);
        campoPoltrona.value = "";
        campoPoltrona.focus()
        return;
    }

    // captura imagem da poltrona, filha de dvCabine. É -1 pois começa em 0
    const imgPoltrona = dvCabine.querySelectorAll("img") [poltrona -1];

    imgPoltrona.src = "img/reservada.png"; // modifica atributo da imagem

    reservadas.push(poltrona); // adiciona poltrona ao vetor reservadas

    campoPoltrona.value = ""; // limpa o campo
    campoPoltrona.focus(); // Joga o foco em inPoltrona

});

frm.btConfirmar.addEventListener("click", ()=> {
    if (reservadas.length == 0) {
        alert("Não há poltronas reservadas");
        campoPoltrona.focus()
        return;
    }

    const ocupadas = localStorage.getItem("cabineOcupadas")
    ? localStorage.getItem("cabineOcupadas").split(";")
    :[];

    //for decrescente, pois as reservas vão sendo removidas a cada iteração da imagem

    for (const numero of reservadas ){
        ocupadas.push(String(numero));

        //captura imagem da poltrona, filha de divCabine
        const imgPoltrona = dvCabine.querySelector(`img[data-poltrona="${numero}"]`);

        imgPoltrona.src = "img/ocupada.png"; // modifica atributo da imagem

    }

    localStorage.setItem("cabineOcupadas", ocupadas.join(";"))
    reservadas.length = 0;

});



