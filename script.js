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
  "CouveFlor",
  "Goiaba",
  "Inhame",
  "Jilo",
  "AboboraJ",
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

// Gerar PDF e salvar pedido
document.getElementById("gerarPDF").addEventListener("click", function () {
  const { jsPDF } = window.jspdf;
  let doc = new jsPDF();

  let recebedor = document.getElementById("recebedor").value || "Não informado";
  let data = document.getElementById("data").value || "Não informado";

  doc.setFont("helvetica", "bold");
  doc.text("Pedido - AgroSystech", 20, 20);
  doc.text("Celinho HortiFruti", 20, 20);
  doc.setFont("helvetica", "normal");
  doc.text(`Recebedor: ${recebedor}`, 20, 30);
  doc.text(`Data: ${data}`, 20, 40);
  doc.text("Produtos:", 20, 50);

  let y = 60;
  produtos.forEach((produto) => {
    const getProduto = document.getElementById("quantity" + produto);
    console.log(getProduto, produto);
    let quantity = document.getElementById("quantity" + produto).value || "0";
    let price = document.getElementById("price" + produto).value || "0.00";
    if (parseInt(quantity) > 0) {
      doc.text(`${quantity} - ${produto} , R$ ${price}`, 20, y);
      y += 10;
    }
  });

  doc.text(`TOTAL: ${quantityTotal.value} volumes, R$ ${priceTotal.value}`, 20, y + 10);
  doc.save(`pedido-${recebedor}-${data}.pdf`);

  salvarPedido(); // Salva o pedido após gerar o PDF
});
