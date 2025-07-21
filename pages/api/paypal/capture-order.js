// pages/api/paypal/capture-order.js
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api"; // Certifique-se de ter esta importação

// Inicialize o WooCommerce API (certifique-se de que suas credenciais estão em variáveis de ambiente)
const woocommerce = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WORDPRESS_URL,
  consumerKey: process.env.WC_CONSUMER_KEY,
  consumerSecret: process.env.WC_CONSUMER_SECRET,
  version: "wc/v3",
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    console.warn(
      `API /paypal/capture-order: Método não permitido: ${req.method}`
    );
    return res.status(405).json({ message: "Method not allowed" });
  }

  const {
    orderID,
    items,
    billingData,
    shippingData,
    sameAsShipping,
    selectedShipping,
    shippingCost,
    isEligibleForFreeShipping,
    customer_id, // CORRIGIDO: Agora recebendo o customer_id do frontend
  } = req.body;

  console.log("API /paypal/capture-order: Dados recebidos:", {
    orderID,
    customer_id,
    billingEmail: billingData?.email,
    itemsCount: items?.length,
  });

  // Adicionado validação mais robusta para os dados recebidos
  if (
    !orderID ||
    !items ||
    items.length === 0 ||
    !billingData ||
    !shippingData
  ) {
    console.error("API /paypal/capture-order: Dados obrigatórios ausentes.");
    return res.status(400).json({
      success: false,
      message:
        "Dados do pedido PayPal, itens do carrinho ou informações de endereço são obrigatórios.",
    });
  }

  // Validação adicional para itens do carrinho: garantir que cada item tenha ID e quantidade
  if (
    !items.every(
      (item) =>
        item.id && typeof item.quantity === "number" && item.quantity > 0
    )
  ) {
    console.error("API /paypal/capture-order: Itens do carrinho inválidos.");
    return res.status(400).json({
      success: false,
      message:
        "Os itens do carrinho devem ter um ID de produto e uma quantidade válida.",
    });
  }

  try {
    // Obter token de acesso do PayPal
    console.log(
      "API /paypal/capture-order: Obtendo token de acesso do PayPal..."
    );
    const authResponse = await fetch(
      `https://api.sandbox.paypal.com/v1/oauth2/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
          ).toString("base64")}`,
        },
        body: "grant_type=client_credentials",
      }
    );

    const authData = await authResponse.json();

    if (!authResponse.ok) {
      console.error(
        "API /paypal/capture-order: Erro de autenticação PayPal:",
        authData
      );
      throw new Error(
        `PayPal auth error: ${
          authData.error_description || "Unknown authentication error"
        }`
      );
    }
    console.log("API /paypal/capture-order: Token de acesso PayPal obtido.");

    // Capturar pagamento do pedido
    console.log(
      `API /paypal/capture-order: Capturando pedido PayPal com ID: ${orderID}...`
    );
    const captureResponse = await fetch(
      `https://api.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData.access_token}`,
        },
      }
    );

    const captureData = await captureResponse.json();
    console.log(
      "API /paypal/capture-order: Resposta de captura PayPal:",
      JSON.stringify(captureData, null, 2)
    );

    if (!captureResponse.ok) {
      console.error(
        "API /paypal/capture-order: Erro na captura PayPal:",
        captureData
      );
      throw new Error(
        `PayPal capture error: ${
          captureData.message || "Unknown capture error"
        }`
      );
    }

    // Verificar se o pagamento foi aprovado
    const paymentStatus = captureData.status;
    const captureDetails = captureData.purchase_units[0]?.payments?.captures[0];

    if (
      paymentStatus === "COMPLETED" &&
      captureDetails?.status === "COMPLETED"
    ) {
      let woocommerceOrder = null;
      try {
        const orderToCreateInWooCommerce = {
          payment_method: "paypal",
          payment_method_title: "PayPal",
          set_paid: true, // Marcar como pago, pois o PayPal já confirmou
          billing: billingData,
          shipping: sameAsShipping ? billingData : shippingData,
          line_items: items.map((item) => ({
            product_id: parseInt(item.id, 10), // Garante que product_id é um número
            quantity: item.quantity,
            variation_id: item.variation_id
              ? parseInt(item.variation_id, 10)
              : undefined,
            meta_data: [
              ...(item.selectedSize
                ? [{ key: "Tamanho", value: item.selectedSize }]
                : []),
              ...(item.selectedColor
                ? [{ key: "Cor", value: item.selectedColor }]
                : []),
            ],
          })),
          shipping_lines: isEligibleForFreeShipping
            ? []
            : [
                {
                  method_id: selectedShipping?.id || "flat_rate",
                  method_title: selectedShipping?.title || "Frete",
                  total: shippingCost ? shippingCost.toFixed(2) : "0.00", // Garante que shippingCost é uma string formatada
                },
              ],
          meta_data: [
            { key: "paypal_order_id", value: orderID },
            { key: "paypal_payment_id", value: captureDetails.id },
            { key: "paypal_payment_status", value: captureDetails.status },
          ],
        };

        // CORRIGIDO: Adicionar customer_id ao payload do WooCommerce se fornecido
        if (customer_id) {
          orderToCreateInWooCommerce.customer_id = customer_id;
          console.log(
            `API /paypal/capture-order: Adicionando customer_id ${customer_id} ao payload do WooCommerce.`
          );
        } else {
          console.log(
            "API /paypal/capture-order: customer_id não fornecido, criando pedido como convidado no WooCommerce."
          );
        }

        console.log(
          "API /paypal/capture-order: Payload do pedido WooCommerce:",
          JSON.stringify(orderToCreateInWooCommerce, null, 2)
        );

        const wcResponse = await woocommerce.post(
          "orders",
          orderToCreateInWooCommerce
        );
        woocommerceOrder = wcResponse.data;
        console.log(
          `API /paypal/capture-order: Pedido WooCommerce criado com sucesso. ID: ${woocommerceOrder.id}, Número: ${woocommerceOrder.number}`
        );

        // Se a criação do pedido no WooCommerce for bem-sucedida, retornar sucesso total
        res.status(200).json({
          success: true,
          paymentID: captureDetails.id,
          status: captureDetails.status,
          amount: captureDetails.amount.value, // Usa o valor real capturado do PayPal
          captureData: captureData,
          woocommerceOrderId: woocommerceOrder.id, // Retorna o ID do WC
          woocommerceOrderNumber: woocommerceOrder.number, // Retorna o número do WC
        });
      } catch (wcError) {
        // Se houver um erro ao criar o pedido no WooCommerce, retornar um erro para o frontend
        const errorMessage = wcError.response?.data?.message || wcError.message;
        console.error(
          "API /paypal/capture-order: Erro ao criar pedido no WooCommerce após captura PayPal:",
          wcError.response?.data || wcError.message
        );
        return res.status(500).json({
          success: false,
          message: `Erro ao finalizar pedido no WooCommerce: ${errorMessage}`,
          details: wcError.response?.data || wcError.message,
        });
      }
    } else {
      // Se o pagamento PayPal não estiver COMPLETED
      console.warn(
        `API /paypal/capture-order: Pagamento PayPal não foi completado. Status: ${paymentStatus}`
      );
      res.status(400).json({
        success: false,
        message: "Pagamento PayPal não foi completado ou status inválido.",
        status: paymentStatus,
        captureData: captureData,
      });
    }
  } catch (error) {
    // Erros na comunicação com PayPal ou outros erros inesperados
    console.error(
      "API /paypal/capture-order: Erro geral no processo de captura PayPal:",
      error.message
    );
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao processar pagamento PayPal.",
      details: error.message,
    });
  }
}
