// pages/api/shipping/calculate.js
import woocommerce from "../../../lib/woocommerce";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const {
    postcode,
    items = [],
    state = "",
    city = "",
    cart_subtotal,
    free_shipping_threshold,
  } = req.body; // Adicionado cart_subtotal e free_shipping_threshold

  if (!postcode) {
    return res.status(400).json({
      message: "CEP é obrigatório para calcular o frete",
    });
  }

  try {
    // Primeiro, vamos buscar as zonas de envio configuradas
    const shippingZones = await woocommerce.get("shipping/zones");

    let applicableZone = null;
    let shippingMethods = [];

    // Verificar se o CEP se enquadra em alguma zona específica
    for (const zone of shippingZones.data) {
      try {
        // Buscar localizações da zona
        const zoneLocations = await woocommerce.get(
          `shipping/zones/${zone.id}/locations`
        );

        // Verificar se o CEP/estado se enquadra nesta zona
        const isApplicable = zoneLocations.data.some((location) => {
          if (location.type === "postcode") {
            // Limpar CEPs para comparação
            const locationCodeClean = location.code.replace(/\D/g, "");
            const inputCodeClean = postcode.replace(/\D/g, "");

            if (location.code.includes("...")) {
              // Faixa de CEP (ex: 01000...01999)
              const [start, end] = location.code
                .split("...")
                .map((c) => c.replace(/\D/g, ""));
              return inputCodeClean >= start && inputCodeClean <= end;
            } else {
              // CEP específico
              return locationCodeClean === inputCodeClean;
            }
          } else if (location.type === "state") {
            // Verificar por estado
            return location.code === state;
          } else if (location.type === "country") {
            // Verificar por país (Brasil = BR)
            return location.code === "BR";
          }
          return false;
        });

        if (isApplicable) {
          applicableZone = zone;
          break;
        }
      } catch (error) {
        console.warn(`Error checking zone ${zone.id}:`, error.message);
        continue;
      }
    }

    // Se não encontrou zona específica, usar zona padrão (ID 0)
    // Nota: O ID da zona padrão no WooCommerce é geralmente 0.
    // Se não houver zona 0, a primeira zona configurada pode ser usada como fallback.
    if (!applicableZone) {
      applicableZone =
        shippingZones.data.find((zone) => zone.id === 0) ||
        shippingZones.data[0];
    }

    if (applicableZone) {
      // Buscar métodos de envio da zona aplicável
      const zoneMethods = await woocommerce.get(
        `shipping/zones/${applicableZone.id}/methods`
      );

      // Calcular custos para cada método
      for (const method of zoneMethods.data) {
        if (!method.enabled) continue;

        let cost = 0;
        let methodTitle = method.title || method.method_title;

        // Lógica de cálculo baseada no tipo de método
        switch (method.method_id) {
          case "flat_rate":
            // Taxa fixa
            cost = parseFloat(method.settings?.cost?.value || 0);

            // Adicionar custo por item se configurado
            if (method.settings?.type?.value === "item") {
              cost *= items.reduce((total, item) => total + item.quantity, 0);
            }
            break;

          case "free_shipping":
            // Frete grátis - APLICAÇÃO DA LÓGICA CONDICIONAL AQUI
            if (cart_subtotal >= free_shipping_threshold) {
              cost = 0;
            } else {
              // Se não for elegível para frete grátis, pular este método
              continue;
            }
            break;

          case "local_pickup":
            // Retirada local
            cost = 0;
            methodTitle = "Retirada na loja";
            break;

          case "correios-pac":
          case "correios-sedex":
          case "correios-sedex-10":
          case "correios-sedex-12":
          case "correios-sedex-hoje":
            // Para métodos dos Correios, usar uma estimativa baseada no peso/distância
            cost = calculateCorreiosShipping(method.method_id, postcode, items);
            break;

          default:
            // Método personalizado - usar configuração padrão
            cost = parseFloat(method.settings?.cost?.value || 10);
        }

        shippingMethods.push({
          method_id: method.method_id,
          instance_id: method.instance_id,
          title: methodTitle,
          cost: cost.toFixed(2), // Garante que o custo seja uma string com 2 casas decimais
          description: method.settings?.description?.value || "",
          delivery_time: getDeliveryTime(method.method_id, postcode),
        });
      }
    }

    // Se não encontrou métodos, retornar método padrão
    if (shippingMethods.length === 0) {
      shippingMethods.push({
        method_id: "flat_rate",
        instance_id: 0,
        title: "Frete Padrão",
        cost: "15.00",
        description: "Entrega padrão",
        delivery_time: "5-10 dias úteis",
      });
    }

    res.status(200).json({
      postcode: postcode,
      zone: applicableZone?.name || "Zona Padrão",
      methods: shippingMethods,
    });
  } catch (error) {
    console.error(
      "Error calculating shipping:",
      error.response?.data || error.message
    );

    // Retornar método padrão em caso de erro
    res.status(200).json({
      postcode: postcode,
      zone: "Zona Padrão",
      methods: [
        {
          method_id: "flat_rate",
          instance_id: 0,
          title: "Frete Padrão",
          cost: "15.00",
          description: "Entrega padrão",
          delivery_time: "5-10 dias úteis",
        },
      ],
    });
  }
}

// Função auxiliar para calcular frete dos Correios
function calculateCorreiosShipping(methodId, postcode, items) {
  // Estimativa baseada no tipo de serviço
  const baseCosts = {
    "correios-pac": 12.0,
    "correios-sedex": 18.0,
    "correios-sedex-10": 25.0,
    "correios-sedex-12": 22.0,
    "correios-sedex-hoje": 35.0,
  };

  let baseCost = baseCosts[methodId] || 15.0;

  // Adicionar custo baseado na quantidade de itens
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  baseCost += totalItems * 2; // R$ 2 por item adicional

  // Ajustar baseado na região (primeiros dígitos do CEP)
  const cepRegion = postcode.substring(0, 2);
  const regionMultiplier = getRegionMultiplier(cepRegion);

  return baseCost * regionMultiplier;
}

// Função auxiliar para obter multiplicador por região
function getRegionMultiplier(cepPrefix) {
  // Multiplicadores baseados nas regiões do Brasil
  const regionMultipliers = {
    // Sudeste (SP, RJ, MG, ES)
    "01": 1.0,
    "02": 1.0,
    "03": 1.0,
    "04": 1.0,
    "05": 1.0,
    "06": 1.0,
    "07": 1.0,
    "08": 1.0,
    "09": 1.0,
    19: 1.0,
    20: 1.0,
    21: 1.0,
    22: 1.0,
    23: 1.0,
    24: 1.0,
    25: 1.0,
    26: 1.0,
    27: 1.0,
    28: 1.0,
    30: 1.0,
    31: 1.0,
    32: 1.0,
    33: 1.0,
    34: 1.0,
    35: 1.0,
    36: 1.0,
    37: 1.0,
    38: 1.0,
    39: 1.0,
    29: 1.0,

    // Sul (RS, SC, PR)
    80: 1.2,
    81: 1.2,
    82: 1.2,
    83: 1.2,
    84: 1.2,
    85: 1.2,
    86: 1.2,
    87: 1.2,
    88: 1.2,
    89: 1.2,
    90: 1.2,
    91: 1.2,
    92: 1.2,
    93: 1.2,
    94: 1.2,
    95: 1.2,
    96: 1.2,
    97: 1.2,
    98: 1.2,
    99: 1.2,

    // Centro-Oeste
    70: 1.3,
    71: 1.3,
    72: 1.3,
    73: 1.3,
    74: 1.3,
    75: 1.3,
    76: 1.3,
    77: 1.3,
    78: 1.3,
    79: 1.3,

    // Nordeste
    40: 1.5,
    41: 1.5,
    42: 1.5,
    43: 1.5,
    44: 1.5,
    45: 1.5,
    46: 1.5,
    47: 1.5,
    48: 1.5,
    49: 1.5,
    50: 1.5,
    51: 1.5,
    52: 1.5,
    53: 1.5,
    54: 1.5,
    55: 1.5,
    56: 1.5,
    57: 1.5,
    58: 1.5,
    59: 1.5,
    60: 1.5,
    61: 1.5,
    62: 1.5,
    63: 1.5,

    // Norte
    68: 1.8,
    69: 1.8,
    64: 1.8,
    65: 1.8,
    66: 1.8,
    67: 1.8,
  };

  return regionMultipliers[cepPrefix] || 1.4; // Padrão para regiões não mapeadas
}

// Função auxiliar para obter tempo de entrega
function getDeliveryTime(methodId, postcode) {
  const deliveryTimes = {
    "correios-pac": "8-12 dias úteis",
    "correios-sedex": "3-5 dias úteis",
    "correios-sedex-10": "1 dia útil",
    "correios-sedex-12": "2 dias úteis",
    "correios-sedex-hoje": "Mesmo dia",
    flat_rate: "5-10 dias úteis",
    free_shipping: "10-15 dias úteis",
    local_pickup: "Imediato",
  };

  return deliveryTimes[methodId] || "5-10 dias úteis";
}
