// components/dashboard/SettingsSection.jsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import {
  FiSettings,
  FiTrash2,
  FiBell,
  FiShield,
  FiAlertTriangle,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export default function SettingsSection({ customer }) {
  const router = useRouter();
  const { logout } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasPendingOrders, setHasPendingOrders] = useState(false);
  const [checkingOrders, setCheckingOrders] = useState(false);

  const [preferences, setPreferences] = useState({
    email_marketing: true,
    order_notifications: true,
    newsletter: true,
    sms_notifications: false,
    marketing_cookies: false,
    analytics_cookies: true,
  });

  // Verificar se há pedidos pendentes
  useEffect(() => {
    checkPendingOrders();
  }, [customer.id]);

  const checkPendingOrders = async () => {
    setCheckingOrders(true);
    try {
      const response = await fetch(`/api/orders/customer/${customer.id}`);
      if (response.ok) {
        const data = await response.json();
        const pendingStatuses = ["pending", "processing", "on-hold"];
        const hasPending = data.orders.some((order) =>
          pendingStatuses.includes(order.status)
        );
        setHasPendingOrders(hasPending);
      }
    } catch (error) {
    } finally {
      setCheckingOrders(false);
    }
  };

  const handlePreferenceChange = (key) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));

    // Aqui você pode fazer uma chamada para a API para salvar as preferências
    toast.success("Preferência atualizada!");
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "EXCLUIR") {
      toast.error('Digite "EXCLUIR" para confirmar');
      return;
    }

    if (hasPendingOrders) {
      toast.error("Não é possível excluir a conta com pedidos pendentes");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/customers/${customer.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir conta");
      }

      toast.success("Conta excluída com sucesso");
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
      toast.error("Erro ao excluir conta. Tente novamente.");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  const preferenceItems = [
    {
      key: "email_marketing",
      title: "E-mails promocionais",
      description: "Receber ofertas e promoções por e-mail",
      icon: FiBell,
    },
    {
      key: "order_notifications",
      title: "Notificações de pedidos",
      description: "Atualizações sobre status dos seus pedidos",
      icon: FiCheck,
    },
    {
      key: "newsletter",
      title: "Newsletter",
      description: "Novidades e lançamentos da marca",
      icon: FiBell,
    },
    {
      key: "sms_notifications",
      title: "SMS",
      description: "Notificações importantes por SMS",
      icon: FiBell,
    },
  ];

  const privacyItems = [
    {
      key: "marketing_cookies",
      title: "Cookies de marketing",
      description: "Permitir cookies para personalizar anúncios",
      icon: FiShield,
    },
    {
      key: "analytics_cookies",
      title: "Cookies de análise",
      description: "Ajudar a melhorar a experiência do site",
      icon: FiShield,
    },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl lg:text-3xl font-light text-gray-900 mb-2">
          Configurações
        </h2>
        <p className="text-gray-600">
          Gerencie suas preferências e configurações da conta
        </p>
      </div>

      <div className="space-y-8">
        {/* Notification Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mr-4">
              <FiBell className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Notificações
              </h3>
              <p className="text-gray-600 text-sm">
                Configure como você quer receber nossas comunicações
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {preferenceItems.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <item.icon className="w-5 h-5 text-gray-500 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences[item.key]}
                    onChange={() => handlePreferenceChange(item.key)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Privacy Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-white mr-4">
              <FiShield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Privacidade
              </h3>
              <p className="text-gray-600 text-sm">
                Controle como seus dados são utilizados
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {privacyItems.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <item.icon className="w-5 h-5 text-gray-500 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences[item.key]}
                    onChange={() => handlePreferenceChange(item.key)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Account Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white border border-red-200 rounded-xl p-6">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white mr-4">
              <FiTrash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Gerenciamento da Conta
              </h3>
              <p className="text-gray-600 text-sm">
                Ações irreversíveis relacionadas à sua conta
              </p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <FiAlertTriangle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-red-900 mb-2">Excluir Conta</h4>
                <p className="text-sm text-red-700 mb-4">
                  Esta ação é irreversível. Todos os seus dados serão
                  permanentemente removidos.
                  {hasPendingOrders && (
                    <span className="block mt-2 font-medium">
                      ⚠️ Você possui pedidos pendentes. Complete ou cancele
                      todos os pedidos antes de excluir sua conta.
                    </span>
                  )}
                </p>

                {checkingOrders ? (
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600 mr-2"></div>
                    Verificando pedidos...
                  </div>
                ) : (
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    disabled={hasPendingOrders}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    <FiTrash2 className="mr-2 h-4 w-4" />
                    Excluir Minha Conta
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white mr-4">
                <FiAlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirmar Exclusão
                </h3>
                <p className="text-sm text-gray-600">
                  Esta ação não pode ser desfeita
                </p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Para confirmar a exclusão da sua conta, digite{" "}
                <strong>EXCLUIR</strong> no campo abaixo:
              </p>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Digite EXCLUIR"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleDeleteAccount}
                disabled={loading || deleteConfirmation !== "EXCLUIR"}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Excluindo...
                  </>
                ) : (
                  <>
                    <FiTrash2 className="mr-2 h-4 w-4" />
                    Excluir Conta
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmation("");
                }}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
                <FiX className="mr-2 h-4 w-4" />
                Cancelar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
