// pages/api/customers/[id].js
import woocommerce from "../../../lib/woocommerce";

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "ID do cliente é obrigatório" });
  }

  try {
    switch (req.method) {
      case "GET":
        // Buscar dados do cliente
        const customer = await woocommerce.get(`customers/${id}`);

        // Remover dados sensíveis
        const { password, ...customerData } = customer.data;

        res.status(200).json(customerData);
        break;

      case "PUT":
        // Atualizar dados do cliente
        const updateData = req.body;

        // Remover campos que não devem ser atualizados via esta API
        delete updateData.id;
        delete updateData.password; // Senha deve ser atualizada via endpoint específico

        const updatedCustomer = await woocommerce.put(
          `customers/${id}`,
          updateData
        );

        // Remover dados sensíveis da resposta
        const { password: _, ...updatedCustomerData } = updatedCustomer.data;

        res.status(200).json({
          message: "Cliente atualizado com sucesso",
          customer: updatedCustomerData,
        });
        break;

      case "DELETE":
        // Verificar se há pedidos pendentes antes de deletar
        try {
          const orders = await woocommerce.get("orders", {
            customer: id,
            per_page: 100,
            status: ["pending", "processing", "on-hold"],
          });

          if (orders.data && orders.data.length > 0) {
            return res.status(400).json({
              message:
                "Não é possível excluir a conta. Existem pedidos pendentes.",
              pending_orders: orders.data.length,
              details:
                "Complete ou cancele todos os pedidos pendentes antes de excluir a conta.",
            });
          }

          // Se não há pedidos pendentes, prosseguir com a exclusão
          await woocommerce.delete(`customers/${id}`, { force: true });

          res.status(200).json({
            message: "Cliente deletado com sucesso",
          });
        } catch (orderError) {
          console.error("Error checking orders:", orderError);

          // Se não conseguir verificar pedidos, não permitir exclusão por segurança
          return res.status(500).json({
            message:
              "Erro ao verificar pedidos pendentes. Tente novamente mais tarde.",
            details: "Por segurança, a exclusão da conta foi bloqueada.",
          });
        }
        break;

      default:
        res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error(
      "Error managing customer:",
      error.response?.data || error.message
    );

    if (error.response?.status === 404) {
      return res.status(404).json({
        message: "Cliente não encontrado",
      });
    }

    // Tratamento específico para erros de exclusão
    if (req.method === "DELETE" && error.response?.status === 400) {
      return res.status(400).json({
        message: "Não foi possível excluir a conta",
        details:
          error.response?.data?.message ||
          "Verifique se não há pedidos pendentes ou dados vinculados à conta.",
      });
    }

    res.status(500).json({
      message: "Erro interno do servidor",
      details: error.response?.data || error.message,
    });
  }
}
