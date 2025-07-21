// pages/api/shipping/tracking.js
import woocommerce from "../../../lib/woocommerce";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { tracking_code, order_id } = req.query;

  if (!tracking_code && !order_id) {
    return res.status(400).json({
      message: "Código de rastreamento ou ID do pedido é obrigatório",
    });
  }

  try {
    let trackingCode = tracking_code;

    // Se foi fornecido order_id, buscar o código de rastreamento
    if (order_id && !tracking_code) {
      const order = await woocommerce.get(`orders/${order_id}`);
      
      // Procurar o código de rastreamento nos meta_data
      const trackingMeta = order.data.meta_data.find(
        meta => meta.key === "_correios_tracking_code" || meta.key === "_tracking_code"
      );
      
      if (!trackingMeta) {
        return res.status(404).json({
          message: "Código de rastreamento não encontrado para este pedido",
        });
      }
      
      trackingCode = trackingMeta.value;
    }

    // Simular consulta de rastreamento dos Correios
    // Em produção, isso seria integrado com a API real dos Correios
    const trackingData = await simulateCorreiosTracking(trackingCode);

    res.status(200).json({
      tracking_code: trackingCode,
      status: trackingData.status,
      events: trackingData.events,
      delivery_info: trackingData.delivery_info,
    });

  } catch (error) {
    console.error("Error tracking package:", error.response?.data || error.message);

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

// Função para simular rastreamento dos Correios
async function simulateCorreiosTracking(trackingCode) {
  // Em produção, aqui seria feita a consulta real à API dos Correios
  // Por enquanto, vamos simular dados baseados no código
  
  const statuses = [
    "Objeto postado",
    "Objeto em trânsito",
    "Objeto saiu para entrega",
    "Objeto entregue",
  ];

  const currentStatus = Math.floor(Math.random() * statuses.length);
  
  const events = [];
  const baseDate = new Date();
  
  for (let i = 0; i <= currentStatus; i++) {
    const eventDate = new Date(baseDate);
    eventDate.setDate(eventDate.getDate() - (currentStatus - i));
    
    events.push({
      date: eventDate.toISOString(),
      time: eventDate.toLocaleTimeString("pt-BR"),
      description: statuses[i],
      location: i === 0 ? "Centro de Distribuição - São Paulo/SP" : 
                i === currentStatus && i === 3 ? "Entregue ao destinatário" :
                "Centro de Distribuição - " + getRandomCity(),
      status: i === currentStatus ? "current" : "completed",
    });
  }

  return {
    status: statuses[currentStatus],
    events: events.reverse(), // Mais recente primeiro
    delivery_info: {
      estimated_delivery: currentStatus < 3 ? 
        new Date(Date.now() + (3 - currentStatus) * 24 * 60 * 60 * 1000).toISOString().split('T')[0] :
        null,
      delivered: currentStatus === 3,
      delivery_date: currentStatus === 3 ? events[0].date.split('T')[0] : null,
    },
  };
}

// Função auxiliar para gerar cidades aleatórias
function getRandomCity() {
  const cities = [
    "São Paulo/SP",
    "Rio de Janeiro/RJ",
    "Belo Horizonte/MG",
    "Brasília/DF",
    "Salvador/BA",
    "Fortaleza/CE",
    "Manaus/AM",
    "Curitiba/PR",
    "Recife/PE",
    "Porto Alegre/RS",
  ];
  
  return cities[Math.floor(Math.random() * cities.length)];
}

