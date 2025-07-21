// pages/api/auth/register.js
import woocommerce from "../../../lib/woocommerce";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password, firstName, lastName, phone } = req.body;

  // Validação básica
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({
      message: "Email, password, firstName e lastName são obrigatórios",
    });
  }

  try {
    // Verificar se o usuário já existe
    const existingUsers = await woocommerce.get("customers", {
      email: email,
    });

    if (existingUsers.data && existingUsers.data.length > 0) {
      return res.status(409).json({
        message: "Usuário já existe com este email",
      });
    }

    // Criar novo usuário no WooCommerce
    const newUser = {
      email: email,
      first_name: firstName,
      last_name: lastName,
      username: email, // Usando email como username
      password: password,
      billing: {
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone || "",
      },
      shipping: {
        first_name: firstName,
        last_name: lastName,
      },
    };

    const response = await woocommerce.post("customers", newUser);

    // Remover senha da resposta por segurança
    const { password: _, ...userWithoutPassword } = response.data;

    res.status(201).json({
      message: "Usuário criado com sucesso",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error(
      "Error creating user in WooCommerce:",
      error.response?.data || error.message
    );

    // Tratar diferentes tipos de erro
    if (error.response?.status === 400) {
      return res.status(400).json({
        message: "Dados inválidos",
        details: error.response.data,
      });
    }

    res.status(500).json({
      message: "Erro interno do servidor",
      details: error.response?.data || error.message,
    });
  }
}

