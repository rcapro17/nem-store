// pages/api/paypal/create-order.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { amount, currency = "BRL", items = [] } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({
      message: "Valor do pedido é obrigatório e deve ser maior que zero",
    });
  }

  // Verificar se as credenciais do PayPal estão configuradas
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error("PayPal credentials not configured");
    return res.status(500).json({
      message: "Configuração do PayPal não encontrada",
    });
  }

  try {
    // Determinar URL base do PayPal (sandbox ou produção)
    const paypalBaseUrl =
      process.env.PAYPAL_ENVIRONMENT === "production"
        ? "https://api.paypal.com"
        : "https://api.sandbox.paypal.com";

    // Obter token de acesso do PayPal
    const authResponse = await fetch(`${paypalBaseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${clientId}:${clientSecret}`
        ).toString("base64")}`,
      },
      body: "grant_type=client_credentials",
    });

    if (!authResponse.ok) {
      const authError = await authResponse.text();
      console.error("PayPal auth error:", authError);
      throw new Error(`Erro de autenticação PayPal: ${authResponse.status}`);
    }

    const authData = await authResponse.json();

    if (!authData.access_token) {
      throw new Error("Token de acesso não recebido do PayPal");
    }

    // Preparar itens para o PayPal
    const paypalItems =
      items.length > 0
        ? items.map((item) => ({
            name: item.name || item.title || "Produto",
            unit_amount: {
              currency_code: currency,
              value: parseFloat(item.price || 0).toFixed(2),
            },
            quantity: (item.quantity || 1).toString(),
          }))
        : [
            {
              name: "Pedido NEM Store",
              unit_amount: {
                currency_code: currency,
                value: parseFloat(amount).toFixed(2),
              },
              quantity: "1",
            },
          ];

    // Criar pedido no PayPal
    const orderPayload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: parseFloat(amount).toFixed(2),
            breakdown: {
              item_total: {
                currency_code: currency,
                value: parseFloat(amount).toFixed(2),
              },
            },
          },
          items: paypalItems,
        },
      ],
      application_context: {
        return_url: `${
          process.env.NEXTAUTH_URL || "http://localhost:3000"
        }/checkout/success`,
        cancel_url: `${
          process.env.NEXTAUTH_URL || "http://localhost:3000"
        }/checkout/cancel`,
        brand_name: "NEM Store",
        locale: "pt-BR",
        landing_page: "BILLING",
        user_action: "PAY_NOW",
      },
    };

    console.log(
      "Creating PayPal order with payload:",
      JSON.stringify(orderPayload, null, 2)
    );

    const orderResponse = await fetch(`${paypalBaseUrl}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authData.access_token}`,
      },
      body: JSON.stringify(orderPayload),
    });

    if (!orderResponse.ok) {
      const orderError = await orderResponse.text();
      console.error("PayPal order error:", orderError);
      throw new Error(`Erro ao criar pedido PayPal: ${orderResponse.status}`);
    }

    const orderData = await orderResponse.json();

    console.log("PayPal order created successfully:", orderData.id);

    res.status(200).json({
      id: orderData.id,
      status: orderData.status,
      links: orderData.links,
    });
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    res.status(500).json({
      message: "Erro ao criar pedido no PayPal",
      details: error.message,
    });
  }
}
