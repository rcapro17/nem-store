// context/AuthContext.js
"use client"; // Certifique-se de que este componente é um Client Component

import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify"; // Certifique-se de que toast está instalado e configurado

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true); // Estado 'loading' para indicar se a inicialização do contexto está completa

  // Carregar usuário do localStorage ao inicializar
  useEffect(() => {
    try {
      const savedCustomer = localStorage.getItem("customer");
      const savedToken = localStorage.getItem("token");

      // Adicionado verificação para garantir que savedCustomer não é a string "undefined" ou "null"
      if (
        savedCustomer &&
        savedToken &&
        savedCustomer !== "undefined" &&
        savedCustomer !== "null"
      ) {
        try {
          const parsedCustomer = JSON.parse(savedCustomer);
          setCustomer(parsedCustomer);
          console.log(
            "AuthContext: Customer loaded from localStorage:",
            parsedCustomer
          );
        } catch (e) {
          console.error(
            "AuthContext: Erro ao analisar dados do cliente salvos no localStorage:",
            e
          );
          // Limpar dados corrompidos para evitar o erro novamente
          localStorage.removeItem("customer");
          localStorage.removeItem("token");
          setCustomer(null); // Garante que o estado seja limpo
        }
      } else {
        // Se não houver dados válidos, garanta que o localStorage esteja limpo
        localStorage.removeItem("customer");
        localStorage.removeItem("token");
        setCustomer(null);
      }
    } catch (error) {
      console.error("AuthContext: Erro ao acessar localStorage:", error);
    } finally {
      setLoading(false); // Define loading como false após tentar carregar do localStorage
      console.log("AuthContext: Initial loading complete.");
    }
  }, []);

  // Loga mudanças no customer e isAuthenticated para depuração
  useEffect(() => {
    console.log("AuthContext: customer changed to", customer);
    console.log("AuthContext: isAuthenticated changed to", !!customer);
  }, [customer]);

  // Função de login
  const login = async (email, password) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("AuthContext: API Login Response Data:", data); // Log da resposta da API

      if (!response.ok) {
        toast.error(data.message || "Erro no login.", {
          position: "top-right",
        });
        throw new Error(data.message || "Erro no login");
      }

      // Salvar dados do usuário e token, verificando se existem
      // CORRIGIDO: Acessando data.user em vez de data.customer
      if (data.user) {
        localStorage.setItem("customer", JSON.stringify(data.user));
      } else {
        localStorage.removeItem("customer");
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      } else {
        localStorage.removeItem("token");
      }

      // CORRIGIDO: Atualiza o estado do contexto com data.user
      setCustomer(data.user);
      toast.success("Login realizado com sucesso!", { position: "top-right" });
      // CORRIGIDO: Retorna data.user como user
      return { success: true, user: data.user };
    } catch (error) {
      console.error("AuthContext: Erro no login:", error);
      // O erro já foi toastado acima se !response.ok
      // Se for um erro de rede ou outro, toaste aqui
      if (!error.message.includes("Erro no login")) {
        // Evita duplicar toast
        toast.error(error.message || "Erro inesperado ao fazer login.", {
          position: "top-right",
        });
      }
      return { success: false, error: error.message };
    }
  };

  // Função de registro
  const register = async (customerData) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerData),
      });

      const data = await response.json();
      console.log("AuthContext: API Register Response Data:", data); // Log da resposta da API

      if (!response.ok) {
        toast.error(data.message || "Erro no registro.", {
          position: "top-right",
        });
        throw new Error(data.message || "Erro no registro");
      }

      toast.success("Conta criada com sucesso! Por favor, faça login.", {
        position: "top-right",
      });
      return { success: true, customer: data.customer };
    } catch (error) {
      console.error("AuthContext: Erro no registro:", error);
      toast.error(error.message || "Erro inesperado ao criar conta.", {
        position: "top-right",
      });
      return { success: false, error: error.message };
    }
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem("customer");
    localStorage.removeItem("token");
    setCustomer(null); // CORRIGIDO: de setUser para setCustomer
    toast.info("Você foi desconectado.", { position: "top-right" });
  };

  // Função para atualizar dados do usuário
  const updateCustomer = async (customerData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token de autenticação não encontrado.");
      }

      const response = await fetch(`/api/customers/${customer.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Usando o token do localStorage
        },
        body: JSON.stringify(customerData),
      });

      const data = await response.json();
      console.log("AuthContext: API Update Customer Response Data:", data); // Log da resposta da API

      if (!response.ok) {
        toast.error(data.message || "Erro ao atualizar usuário.", {
          position: "top-right",
        });
        throw new Error(data.message || "Erro ao atualizar usuário");
      }

      // Atualizar dados locais
      const updatedCustomer = { ...customer, ...data.customer };
      localStorage.setItem("customer", JSON.stringify(updatedCustomer)); // CORRIGIDO: de "user" para "customer"
      setCustomer(updatedCustomer); // CORRIGIDO: de setUser para setCustomer
      toast.success("Dados atualizados com sucesso!", {
        position: "top-right",
      });

      return { success: true, customer: updatedCustomer };
    } catch (error) {
      console.error("AuthContext: Erro ao atualizar usuário:", error);
      toast.error(error.message || "Erro inesperado ao atualizar usuário.", {
        position: "top-right",
      });
      return { success: false, error: error.message };
    }
  };

  // Verificar se usuário está logado
  const isAuthenticated = !!customer;

  const value = {
    customer,
    loading, // Expondo o estado de carregamento
    isAuthenticated,
    login,
    register,
    logout,
    updateCustomer,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
