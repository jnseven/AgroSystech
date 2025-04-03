let produtos = [
  "Limao",
  "Abacate",
  "Mandioca",
  "Melancia",
  "Abacaxi",
  "Abobrinha",
  "Alho",
  "BananaCaturra",
  "BananaOuro",
  "BananaPrata",
  "BananaTerra",
  "Baroa",
  "Berinjela",
  "Beterraba",
  "Brocolis",
  "Cenoura",
  "CenouraM",
  "Chuchu",
  "Couve-Flor",
  "Coco-Seco",
  "Goiaba",
  "Inhame",
  "Jilo",
  "AboboraJaponesa",
  "CebolaRoxa",
  "TomateG",
  "TomateM",
  "PepinoCaipira",
  "Repolho",
  "RepolhoRoxo",
  "AboboraDagua",
  "Maracuja",
  "Milho",
  "Pimentao",
  "PimentaoColorido",
  "Quiabo",
  "TomateItaliano",
  "MelaoAmarelo",
  "MangaPalmer",
  "MangaTommy",
  "PepinoPreto",
  "PepinoJapones",
  "Pitaya",
  "AlhoPoro",
  "MamaoHavai",
  "MamaoFormosa",
  "TomateCereja",
  "Vagem",
];

let quantityTotal = document.getElementById("quantityTotal");
let priceTotal = document.getElementById("priceTotal");

// Função para calcular o total
function calcularTotal() {
  let totalQuantidade = 0;
  let totalPreco = 0;

  produtos.forEach((produto) => {
    let quantity = document.getElementById("quantity" + produto);
    let price = document.getElementById("price" + produto);
    if (quantity && price) {
      totalQuantidade += parseInt(quantity.value) || 0;
      totalPreco += (parseFloat(price.value) || 0) * (parseInt(quantity.value) || 0);
    }
  });

  quantityTotal.value = totalQuantidade;
  priceTotal.value = totalPreco.toFixed(2);
}

// Adiciona o evento de "input" para atualizar os totais
produtos.forEach((produto) => {
  let quantity = document.getElementById("quantity" + produto);
  let price = document.getElementById("price" + produto);
  if (quantity && price) {
    quantity.addEventListener("input", calcularTotal);
    price.addEventListener("input", calcularTotal);
  }
});

// Função para salvar o pedido no localStorage
function salvarPedido() {
  const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
  const recebedor = document.getElementById("recebedor").value || "Não informado";
  const data = document.getElementById("data").value || "Não informado";
  let itensPedido = [];

  produtos.forEach((produto) => {
    let quantity = document.getElementById("quantity" + produto).value || "0";
    let price = document.getElementById("price" + produto).value || "0.00";
    if (parseInt(quantity) > 0) {
      itensPedido.push({ produto, quantity, price });
    }
  });

  pedidos.push({ recebedor, data, itensPedido, total: priceTotal.value });
  localStorage.setItem("pedidos", JSON.stringify(pedidos));
}

document.getElementById("gerarPDF").addEventListener("click", function () {
  const { jsPDF } = window.jspdf;
  let doc = new jsPDF();

  let recebedor = document.getElementById("recebedor").value || "Não informado";
  let data = document.getElementById("data").value || "Não informado";

  // Inserindo a logo no topo do PDF (substitua "logo.png" pela sua imagem)
  let img = new Image();
  img.src = "imagens/AgroSystech (1).png"; // Caminho da sua logo
  img.onload = function () {
    doc.addImage(img, "PNG", 150, 10, 40, 20); // Posição e tamanho da logo

    doc.setFont("helvetica", "bold");
    doc.text("Pedido - Celinho Legumes", 20, 20);

    doc.setFont("helvetica", "normal");
    doc.text(`Recebedor: ${recebedor}`, 20, 30);
    doc.text(`Data: ${data}`, 20, 40);
    doc.text("Produtos:", 20, 50);

    let y = 60;
    let x = 20;
    let lineCount = 0;

    produtos.forEach((produto) => {
      let quantityEl = document.getElementById("quantity" + produto);
      let priceEl = document.getElementById("price" + produto);

      if (!quantityEl || !priceEl) return;

      let quantity = quantityEl.value || "0";
      let price = priceEl.value || "0.00";

      if (parseFloat(quantity) > 0) {
        // Só adiciona se o preço for maior que 0
        if (parseInt(quantity) < 10) {
          quantity = `0${quantity}`; // Adiciona ")" antes da quantidade se menor que 10
        }

        doc.text(`${quantity} - ${produto}, R$ ${price}`, x, y);
        y += 10;
        lineCount++;

        if (lineCount === 23) {
          x += 90; // Move para a direita da folha
          y = 60; // Reinicia a altura
          lineCount = 0; // Reinicia a contagem
        }
      }
    });
    doc.text(`TOTAL: ${quantityTotal.value} volumes, R$ ${priceTotal.value}`, 105, y + 10);
    doc.save(`pedido-${recebedor}-${data}.pdf`);

    salvarPedido(); // Salva o pedido após gerar o PDF
  };
});
