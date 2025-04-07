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
  "Gengibre",
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
  "BatataDoce",
  "BatataInglesa",
  "PepinoPreto",
  "PepinoJapones",
  "Pitaya",
  "AlhoPoro",
  "MamaoHavai",
  "MamaoFormosa",
  "TomateCereja",
  "Vagem",
];

const semRetornavel = [
  "Alho",
  "AlhoPoro",
  "BatataInglesa",
  "CebolaRoxa",
  "Coco-Seco",
  "Repolho",
  "RepolhoRoxo",
  "Melancia",
];

let quantityTotal = document.getElementById("quantityTotal");
let priceTotal = document.getElementById("priceTotal");

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

  // Lógica especial da melancia
  const melanciaUnidades = parseInt(document.getElementById("melancia-qtd").value) || 0;
  const melanciaKG = parseFloat(document.getElementById("melancia-kg").value) || 0;
  const melanciaPreco = parseFloat(document.getElementById("melancia-preco").value) || 0;

  totalQuantidade += melanciaUnidades;
  totalPreco += melanciaKG * melanciaPreco;

  quantityTotal.value = totalQuantidade;
  priceTotal.value = totalPreco.toFixed(2);
}

// Eventos de input para todos os produtos
produtos.forEach((produto) => {
  let quantity = document.getElementById("quantity" + produto);
  let price = document.getElementById("price" + produto);
  if (quantity && price) {
    quantity.addEventListener("input", calcularTotal);
    price.addEventListener("input", calcularTotal);
  }
});

// Eventos de input para melancia
["melancia-qtd", "melancia-kg", "melancia-preco"].forEach((id) => {
  const input = document.getElementById(id);
  if (input) input.addEventListener("input", calcularTotal);
});

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

  // Salva também melancia
  const melanciaQtd = parseInt(document.getElementById("melancia-qtd").value) || 0;
  const melanciaKG = parseFloat(document.getElementById("melancia-kg").value) || 0;
  const melanciaPreco = parseFloat(document.getElementById("melancia-preco").value) || 0;

  if (melanciaQtd > 0 && melanciaKG > 0 && melanciaPreco > 0) {
    itensPedido.push({ produto: "Melancia", quantity: `${melanciaQtd} un`, price: melanciaPreco.toFixed(2) });
  }

  pedidos.push({ recebedor, data, itensPedido, total: priceTotal.value });
  localStorage.setItem("pedidos", JSON.stringify(pedidos));
}

document.getElementById("gerarPDF").addEventListener("click", function () {
  const { jsPDF } = window.jspdf;
  let doc = new jsPDF();

  const recebedor = document.getElementById("recebedor").value || "Não informado";
  const data = document.getElementById("data").value || "Não informado";

  let img = new Image();
  img.src = "imagens/AgroSystech (1).png";
  img.onload = function () {
    doc.addImage(img, "PNG", 140, 10, 50, 15);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Pedido - Celinho Legumes", 20, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Recebedor: ${recebedor}`, 20, 30);
    doc.text(`Data: ${data}`, 20, 35);
    doc.text("Produtos:", 20, 45);

    let y = 50;
    let x = 20;
    let lineCount = 0;
    let columnCount = 0;
    let totalVolumes = 0;
    let caixasPlasticas = 0;
    let semRetornaveis = 0;

    produtos.forEach((produto) => {
      let quantityEl = document.getElementById("quantity" + produto);
      let priceEl = document.getElementById("price" + produto);

      if (!quantityEl || !priceEl) return;

      let quantity = parseInt(quantityEl.value) || 0;
      let price = parseFloat(priceEl.value) || 0.0;

      if (quantity > 0) {
        let subtotal = quantity * price;
        totalVolumes += quantity;

        if (semRetornavel.includes(produto)) {
          semRetornaveis += quantity;
        } else {
          caixasPlasticas += quantity;
        }

        let formattedQuantity = quantity < 10 ? `0${quantity}` : quantity;
        doc.text(
          `${formattedQuantity} - ${produto}, R$ ${price.toFixed(2)} (Subtotal: R$ ${subtotal.toFixed(2)})`,
          x,
          y
        );

        y += 6;
        lineCount++;
        if (lineCount === 30) {
          x += 90;
          y = 50;
          lineCount = 0;
          columnCount++;
        }
      }
    });

    // Melancia separada
    const melanciaQtd = parseInt(document.getElementById("melancia-qtd").value) || 0;
    const melanciaKG = parseFloat(document.getElementById("melancia-kg").value) || 0;
    const melanciaPreco = parseFloat(document.getElementById("melancia-preco").value) || 0;

    if (melanciaQtd > 0 && melanciaKG > 0 && melanciaPreco > 0) {
      const subtotal = melanciaKG * melanciaPreco;
      doc.text(
        `${melanciaQtd} - Melancia (${melanciaKG.toFixed(2)} KG x R$ ${melanciaPreco.toFixed(
          2
        )}) (Subtotal: R$ ${subtotal.toFixed(2)})`,
        x,
        y
      );
      y += 6;
      lineCount++;

      totalVolumes += melanciaQtd;
      semRetornaveis += melanciaQtd;
    }

    let volumesTexto = `${totalVolumes} volumes (${caixasPlasticas} caixas plásticas, ${semRetornaveis} sem embalagens retornáveis)`;

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL: ${volumesTexto}, R$ ${priceTotal.value}`, 10, 250);

    doc.save(`pedido-${recebedor}-${data}.pdf`);
    salvarPedido();
  };
});
