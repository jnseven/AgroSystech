document.addEventListener("DOMContentLoaded", function () {
  // Função para carregar o histórico de pedidos
  function carregarHistorico() {
    const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    const listaPedidos = document.getElementById("listaPedidos");
    listaPedidos.innerHTML = ""; // Limpa o histórico antes de recarregar

    pedidos.forEach((pedido) => {
      const divPedido = document.createElement("div");
      divPedido.classList.add("pedido");

      let itens = `<p><strong>Recebedor:</strong> ${pedido.recebedor}</p>`;
      itens += `<p><strong>Data:</strong> ${pedido.data}</p>`;
      itens += "<p><strong>Produtos:</strong></p>";

      pedido.itensPedido.forEach((item) => {
        itens += `<p>- ${item.produto}: ${item.quantity} unidades, R$ ${item.price}</p>`;
      });

      itens += `<p><strong>Total:</strong> R$ ${pedido.total}</p>`;

      divPedido.innerHTML = itens;
      listaPedidos.appendChild(divPedido);
    });
  }

  // Chama a função para carregar o histórico
  carregarHistorico();
});
