// pages/api/shipping/zones.js
import woocommerce from "../../../lib/woocommerce";

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case "GET":
        // Listar todas as zonas de envio
        const zones = await woocommerce.get("shipping/zones");
        
        // Para cada zona, buscar também os métodos e localizações
        const zonesWithDetails = await Promise.all(
          zones.data.map(async (zone) => {
            try {
              const [methods, locations] = await Promise.all([
                woocommerce.get(`shipping/zones/${zone.id}/methods`),
                woocommerce.get(`shipping/zones/${zone.id}/locations`),
              ]);

              return {
                ...zone,
                methods: methods.data,
                locations: locations.data,
              };
            } catch (error) {
              console.warn(`Error fetching details for zone ${zone.id}:`, error.message);
              return {
                ...zone,
                methods: [],
                locations: [],
              };
            }
          })
        );

        res.status(200).json(zonesWithDetails);
        break;

      case "POST":
        // Criar nova zona de envio
        const { name, order = 0 } = req.body;
        
        if (!name) {
          return res.status(400).json({
            message: "Nome da zona é obrigatório",
          });
        }

        const newZone = await woocommerce.post("shipping/zones", {
          name,
          order,
        });

        res.status(201).json({
          message: "Zona criada com sucesso",
          zone: newZone.data,
        });
        break;

      default:
        res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error(
      "Error managing shipping zones:",
      error.response?.data || error.message
    );

    res.status(500).json({
      message: "Erro interno do servidor",
      details: error.response?.data || error.message,
    });
  }
}

