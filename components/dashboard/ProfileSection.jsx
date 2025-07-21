// components/dashboard/ProfileSection.jsx
"use client";

import { useState, useEffect } from "react"; // Adicionado useEffect
import { motion } from "framer-motion";
import {
  FiEdit3,
  FiSave,
  FiX,
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiShoppingBag,
  FiMapPin, // Mantido FiMapPin para "Total de pedidos" que pode ser um placeholder
} from "react-icons/fi";
import { toast } from "react-toastify"; // CORRIGIDO: de react-hot-toast para react-toastify

// Função auxiliar para formatar a data para o input type="date" (YYYY-MM-DD)
const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  // Tenta parsear formatos comuns (DD/MM/YYYY ou YYYY-MM-DD ou ISO)
  const date = new Date(
    dateString.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1")
  );
  if (isNaN(date.getTime())) {
    return ""; // Retorna vazio se a data for inválida
  }
  return date.toISOString().split("T")[0];
};

// Função auxiliar para formatar a data para exibição (DD/MM/YYYY)
const formatDateForDisplay = (dateString) => {
  if (!dateString) return "Não informado";
  const date = new Date(
    dateString.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1")
  );
  if (isNaN(date.getTime())) {
    return "Não informado";
  }
  return date.toLocaleDateString("pt-BR");
};

export default function ProfileSection({ customer }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: customer?.first_name || "",
    last_name: customer?.last_name || "",
    email: customer?.email || "",
    // CORRIGIDO: Acessando phone de billing
    phone: customer?.billing?.phone || "",
    // CORRIGIDO: Acessando birthdate de billing e formatando para input
    date_of_birth: formatDateForInput(customer?.billing?.birthdate),
  });

  // Atualiza formData se o customer mudar (ex: após um login ou atualização no contexto)
  useEffect(() => {
    setFormData({
      first_name: customer?.first_name || "",
      last_name: customer?.last_name || "",
      email: customer?.email || "",
      phone: customer?.billing?.phone || "",
      date_of_birth: formatDateForInput(customer?.billing?.birthdate),
    });
  }, [customer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Prepara os dados para enviar, incluindo os campos aninhados em 'billing'
      const dataToUpdate = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        billing: {
          phone: formData.phone,
          // Formata a data de volta para o formato que a API pode esperar (DD/MM/YYYY)
          // ou mantém o formato ISO se a API for flexível
          birthdate: formData.date_of_birth
            ? new Date(formData.date_of_birth).toLocaleDateString("pt-BR")
            : "",
        },
      };

      // Recupera o token de autenticação do localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token de autenticação não encontrado.");
      }

      const response = await fetch(`/api/customers/${customer.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Inclui o token de autenticação
        },
        body: JSON.stringify(dataToUpdate), // Envia os dados formatados
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao atualizar perfil");
      }

      const result = await response.json();
      toast.success("Perfil atualizado com sucesso!");
      setIsEditing(false);

      // Se você tiver uma função updateCustomer no seu AuthContext, chame-a aqui
      // para garantir que o estado global do cliente seja atualizado.
      // Exemplo: updateCustomer(result); // Assumindo que 'result' contém o objeto customer atualizado
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error(
        error.message || "Erro ao atualizar perfil. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reseta o formData para os valores originais do customer
    setFormData({
      first_name: customer?.billing?.first_name || "",
      last_name: customer?.last_name || "",
      email: customer?.email || "",
      phone: customer?.billing?.phone || "",
      date_of_birth: formatDateForInput(customer?.billing?.birthdate),
    });
    setIsEditing(false);
  };

  const profileStats = [
    {
      label: "Membro desde",
      value: customer?.date_created
        ? new Date(customer.date_created).toLocaleDateString("pt-BR")
        : "N/A",
      icon: FiCalendar,
      color: "text-blue-600",
    },
    {
      label: "Total de pedidos",
      // A API do WooCommerce não fornece orders_count diretamente no objeto customer v3.
      // Você precisaria de um endpoint customizado ou fazer outra requisição para contar.
      // Por enquanto, mantenha um valor padrão ou remova se não for implementado.
      value: customer?.orders_count || "0", // Placeholder
      icon: FiShoppingBag, // CORRIGIDO: Usando FiShoppingBag para pedidos
      color: "text-green-600",
    },
    {
      label: "Status da conta",
      value: "Ativa", // Este valor é estático aqui, pode ser dinâmico se a API fornecer
      icon: FiUser,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl lg:text-3xl font-light text-gray-900 mb-2">
            Meu Perfil
          </h2>
          <p className="text-gray-600">
            Gerencie suas informações pessoais e preferências
          </p>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
            <FiEdit3 className="mr-2 h-4 w-4" />
            Editar
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50">
              <FiSave className="mr-2 h-4 w-4" />
              {loading ? "Salvando..." : "Salvar"}
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors">
              <FiX className="mr-2 h-4 w-4" />
              Cancelar
            </button>
          </div>
        )}
      </div>

      {/* Profile Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {profileStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center">
              <div
                className={`p-2 rounded-lg bg-white shadow-sm ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Profile Form */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Informações Pessoais
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiUser className="inline mr-2 h-4 w-4" />
              Nome
            </label>
            {isEditing ? (
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Seu nome"
              />
            ) : (
              // CORRIGIDO: de user?.first_name para customer?.first_name
              <div className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900">
                {customer?.billing?.first_name || "Não informado"}
              </div>
            )}
          </div>

          {/* Sobrenome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiUser className="inline mr-2 h-4 w-4" />
              Sobrenome
            </label>
            {isEditing ? (
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Seu sobrenome"
              />
            ) : (
              <div className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900">
                {customer?.billing?.last_name || "Não informado"}
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiMail className="inline mr-2 h-4 w-4" />
              E-mail
            </label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="seu@email.com"
              />
            ) : (
              <div className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900">
                {customer?.email}
              </div>
            )}
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiPhone className="inline mr-2 h-4 w-4" />
              Telefone
            </label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="(11) 99999-9999"
              />
            ) : (
              // CORRIGIDO: Acessando phone de billing
              <div className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900">
                {customer?.billing?.phone || "Não informado"}
              </div>
            )}
          </div>

          {/* Data de Nascimento */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiCalendar className="inline mr-2 h-4 w-4" />
              Data de Nascimento
            </label>
            {isEditing ? (
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleInputChange}
                className="w-full md:w-1/2 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            ) : (
              // CORRIGIDO: Acessando birthdate de billing e formatando para exibição
              <div className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 w-full md:w-1/2">
                {formatDateForDisplay(customer?.birthdate)}
              </div>
            )}
          </div>
        </div>

        {/* Additional Info */}
        {!isEditing && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="text-md font-medium text-gray-900 mb-4">
              Informações da Conta
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">ID do Cliente:</span>
                <span className="ml-2 font-mono text-gray-900">
                  #{customer?.id}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Última atualização:</span>
                <span className="ml-2 text-gray-900">
                  {customer?.date_modified
                    ? new Date(customer.date_modified).toLocaleDateString(
                        "pt-BR"
                      )
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
