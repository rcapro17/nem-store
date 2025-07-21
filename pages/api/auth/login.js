// pages/api/auth/login.js
import woocommerce from "../../../lib/woocommerce";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password } = req.body;

  // Validação básica
  if (!email || !password) {
    return res.status(400).json({
      message: "Email e password são obrigatórios",
    });
  }

  try {
    // Buscar usuário por email
    const users = await woocommerce.get("customers", {
      email: email,
    });

    if (!users.data || users.data.length === 0) {
      return res.status(401).json({
        message: "Credenciais inválidas",
      });
    }

    const user = users.data[0];

    // Nota: WooCommerce REST API não permite verificação direta de senha
    // Em um ambiente de produção, você precisaria implementar uma verificação
    // personalizada ou usar JWT tokens do WooCommerce
    
    // Por enquanto, vamos simular a autenticação
    // Em produção, você deve implementar uma verificação segura de senha
    
    // Remover dados sensíveis da resposta
    const { password: _, ...userWithoutPassword } = user;

    // Criar uma sessão simples (em produção, use JWT ou sessões seguras)
    const sessionData = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      billing: user.billing,
      shipping: user.shipping,
    };

    res.status(200).json({
      message: "Login realizado com sucesso",
      user: sessionData,
      // Em produção, você retornaria um JWT token aqui
      token: `temp_token_${user.id}_${Date.now()}`,
    });
  } catch (error) {
    console.error(
      "Error during login:",
      error.response?.data || error.message
    );

    res.status(500).json({
      message: "Erro interno do servidor",
      details: error.response?.data || error.message,
    });
  }
}

