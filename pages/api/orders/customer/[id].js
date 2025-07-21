// pages/api/orders/customer/[id].js
import woocommerce from "../../../../lib/woocommerce";

export default async function handler(req, res) {
  const { id } = req.query; // 'id' aqui é o customerId

  console.log(`API: Requisição recebida para /api/orders/customer/${id}`);

  if (!id) {
    console.error("API: ID do cliente é obrigatório, mas não foi fornecido.");
    return res.status(400).json({ message: "ID do cliente é obrigatório" });
  }

  try {
    switch (req.method) {
      case "GET":
        console.log(`API: Tentando buscar pedidos para o cliente ID: ${id}`);
        const ordersResponse = await woocommerce.get("orders", {
          customer: id,
          per_page: 100, // Ajuste conforme necessário
          orderby: "date",
          order: "desc",
        });

        console.log(
          "API: Resposta bruta do WooCommerce (pedidos):",
          JSON.stringify(ordersResponse.data, null, 2)
        );

        // Verifica se a resposta do WooCommerce contém dados
        if (!ordersResponse.data || ordersResponse.data.length === 0) {
          console.log(
            `API: Nenhuma ordem encontrada no WooCommerce para o cliente ID: ${id}`
          );
          return res.status(200).json({ orders: [], total_orders: 0 });
        }

        // Formatar dados dos pedidos para o frontend
        const formattedOrders = ordersResponse.data.map((order) => ({
          id: order.id,
          number: order.number,
          status: order.status,
          date_created: order.date_created,
          date_modified: order.date_modified,
          total: order.total,
          currency: order.currency,
          payment_method: order.payment_method,
          payment_method_title: order.payment_method_title,
          billing: order.billing,
          shipping: order.shipping,
          line_items: order.line_items.map((item) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            total: item.total,
            image: item.image?.src || null, // Garante que a imagem seja o src
            product_id: item.product_id,
            variation_id: item.variation_id,
          })),
          shipping_lines: order.shipping_lines,
          tax_lines: order.tax_lines,
          meta_data: order.meta_data,
        }));

        console.log(
          `API: ${formattedOrders.length} pedidos formatados para o cliente ID: ${id}`
        );
        res.status(200).json({
          orders: formattedOrders,
          total_orders: formattedOrders.length,
        });
        break;

      default:
        console.warn(`API: Método não permitido: ${req.method}`);
        res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error(
      "API: Erro ao buscar pedidos do cliente:",
      error.response?.data || error.message
    );

    if (error.response?.status === 404) {
      return res.status(404).json({
        message: "Cliente não encontrado no WooCommerce.",
        details: error.response?.data || error.message,
      });
    }

    res.status(500).json({
      message: "Erro interno do servidor ao processar pedidos.",
      details: error.response?.data || error.message,
    });
  }
}
