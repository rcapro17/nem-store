// pages/api/orders/update-payment.js
import woocommerce from "../../../lib/woocommerce";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const {
    order_id,
    payment_status,
    transaction_id,
    payment_details = {},
  } = req.body;

  if (!order_id) {
    return res.status(400).json({
      message: "ID do pedido é obrigatório",
    });
  }

  try {
    // Preparar dados de atualização
    const updateData = {
      meta_data: [
        {
          key: "_transaction_id",
          value: transaction_id || "",
        },
        {
          key: "_payment_method",
          value: "paypal",
        },
        {
          key: "_payment_method_title",
          value: "PayPal",
        },
        {
          key: "_paypal_payment_details",
          value: JSON.stringify(payment_details),
        },
        {
          key: "_paid_date",
          value: new Date().toISOString(),
        },
      ],
    };

    // Definir status baseado no payment_status
    if (payment_status === "COMPLETED") {
      updateData.status = "processing"; // ou "completed" dependendo da sua lógica
      updateData.set_paid = true;
    } else if (payment_status === "PENDING") {
      updateData.status = "on-hold";
    } else if (payment_status === "FAILED") {
      updateData.status = "failed";
    }

    // Atualizar pedido no WooCommerce
    const response = await woocommerce.put(`orders/${order_id}`, updateData);

    // Se o pagamento foi completado, adicionar nota ao pedido
    if (payment_status === "COMPLETED") {
      await woocommerce.post(`orders/${order_id}/notes`, {
        note: `Pagamento aprovado via PayPal. Transaction ID: ${transaction_id}`,
        customer_note: false,
      });
    }

    res.status(200).json({
      message: "Status de pagamento atualizado com sucesso",
      order: response.data,
    });
  } catch (error) {
    console.error(
      "Error updating payment status:",
      error.response?.data || error.message
    );

    if (error.response?.status === 404) {
      return res.status(404).json({
        message: "Pedido não encontrado",
      });
    }

    res.status(500).json({
      message: "Erro interno do servidor",
      details: error.response?.data || error.message,
    });
  }
}

