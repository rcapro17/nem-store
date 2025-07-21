// pages/api/orders/create.js
import woocommerce from "../../../lib/woocommerce";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const {
    customer_id,
    billing,
    shipping,
    line_items,
    shipping_lines,
    payment_method,
    payment_method_title,
    set_paid = false,
    meta_data = [],
  } = req.body;

  // Validação básica
  if (!line_items || line_items.length === 0) {
    return res.status(400).json({
      message: "Itens do pedido são obrigatórios",
    });
  }

  if (!billing || !billing.email) {
    return res.status(400).json({
      message: "Dados de cobrança são obrigatórios",
    });
  }

  try {
    // Preparar dados do pedido
    const orderData = {
      payment_method: payment_method || "paypal",
      payment_method_title: payment_method_title || "PayPal",
      set_paid: set_paid,
      billing: {
        first_name: billing.first_name || "",
        last_name: billing.last_name || "",
        address_1: billing.address_1 || "",
        address_2: billing.address_2 || "",
        city: billing.city || "",
        state: billing.state || "",
        postcode: billing.postcode || "",
        country: billing.country || "BR",
        email: billing.email,
        phone: billing.phone || "",
      },
      shipping: shipping || billing, // Usar billing como padrão se shipping não fornecido
      line_items: line_items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        variation_id: item.variation_id || 0,
        meta_data: item.meta_data || [],
      })),
      shipping_lines: shipping_lines || [],
      meta_data: [
        ...meta_data,
        {
          key: "_created_via",
          value: "next-js-frontend",
        },
        {
          key: "_order_source",
          value: "website",
        },
      ],
    };

    // Adicionar customer_id se fornecido
    if (customer_id) {
      orderData.customer_id = customer_id;
    }

    // Criar pedido no WooCommerce
    const response = await woocommerce.post("orders", orderData);

    res.status(201).json({
      message: "Pedido criado com sucesso",
      order: response.data,
    });
  } catch (error) {
    console.error(
      "Error creating order in WooCommerce:",
      error.response?.data || error.message
    );

    // Tratar diferentes tipos de erro
    if (error.response?.status === 400) {
      return res.status(400).json({
        message: "Dados do pedido inválidos",
        details: error.response.data,
      });
    }

    res.status(500).json({
      message: "Erro interno do servidor",
      details: error.response?.data || error.message,
    });
  }
}

