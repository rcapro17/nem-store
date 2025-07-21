// components/dashboard/OrdersSection.jsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  FiShoppingBag,
  FiPackage,
  FiTruck,
  FiCheck,
  FiX,
  FiClock,
  FiEye,
  FiRefreshCw,
} from "react-icons/fi";
import { toast } from "react-toastify"; // CORRIGIDO: de react-hot-toast para react-toastify

export default function OrdersSection({ customerId }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    console.log("OrdersSection: customerId changed to", customerId);
    if (customerId) {
      // Garante que customerId existe antes de buscar
      fetchOrders();
    } else {
      setLoading(false); // Se não houver customerId, não carregue
      setOrders([]); // Garante que a lista de pedidos esteja vazia
    }
  }, [customerId]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log(
        `OrdersSection: Fetching orders for customer ID: ${customerId}`
      );
      const response = await fetch(`/api/orders/customer/${customerId}`);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("OrdersSection: Erro na resposta da API:", errorData);
        throw new Error(errorData.message || "Erro ao buscar pedidos");
      }

      const data = await response.json();
      console.log("OrdersSection: API Response Data:", data); // Log da resposta completa da API

      // A API retorna { orders: [...] }, então acessamos data.orders
      setOrders(data.orders || []);
      if (data.orders && data.orders.length === 0) {
        toast.info("Nenhum pedido encontrado para este cliente.");
      }
    } catch (error) {
      console.error("OrdersSection: Erro ao buscar pedidos:", error);
      toast.error(error.message || "Erro ao carregar pedidos");
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: {
        label: "Pendente",
        color: "bg-yellow-100 text-yellow-800",
        icon: FiClock,
        description: "Aguardando pagamento",
      },
      processing: {
        label: "Processando",
        color: "bg-blue-100 text-blue-800",
        icon: FiPackage,
        description: "Pedido em preparação",
      },
      "on-hold": {
        label: "Em Espera",
        color: "bg-orange-100 text-orange-800",
        icon: FiClock,
        description: "Aguardando confirmação",
      },
      completed: {
        label: "Concluído",
        color: "bg-green-100 text-green-800",
        icon: FiCheck,
        description: "Pedido entregue",
      },
      cancelled: {
        label: "Cancelado",
        color: "bg-red-100 text-red-800",
        icon: FiX,
        description: "Pedido cancelado",
      },
      refunded: {
        label: "Reembolsado",
        color: "bg-purple-100 text-purple-800",
        icon: FiRefreshCw,
        description: "Valor reembolsado",
      },
      failed: {
        label: "Falhou",
        color: "bg-red-100 text-red-800",
        icon: FiX,
        description: "Pagamento falhou",
      },
      // Adicione outros status personalizados do seu WooCommerce aqui, se houver
    };

    return (
      statusMap[status] || {
        label:
          status.charAt(0).toUpperCase() + status.slice(1).replace(/-/g, " "), // Formata status como "On Hold"
        color: "bg-gray-100 text-gray-800",
        icon: FiPackage,
        description: "Status desconhecido",
      }
    );
  };

  const formatCurrency = (value, currency = "BRL") => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: currency,
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      console.error("Erro ao formatar data:", dateString, e);
      return "Data inválida";
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
          <p className="ml-4 text-gray-600">Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl lg:text-3xl font-light text-gray-900 mb-2">
            Meus Pedidos
          </h2>
          <p className="text-gray-600">
            Acompanhe o status dos seus pedidos e histórico de compras
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
          <FiRefreshCw className="mr-2 h-4 w-4" />
          Atualizar
        </button>
      </div>

      {orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Nenhum pedido encontrado
          </h3>
          <p className="text-gray-600 mb-8">
            Você ainda não fez nenhum pedido. Que tal começar a explorar nossos
            produtos?
          </p>
          <Link
            href="/products"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
            <FiShoppingBag className="mr-2 h-5 w-5" />
            Começar a Comprar
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => {
            const statusInfo = getStatusInfo(order.status);
            const StatusIcon = statusInfo.icon;

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 mr-4">
                        Pedido #{order.number}
                      </h3>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                        <StatusIcon className="w-4 h-4 mr-1" />
                        {statusInfo.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                      <div>
                        <span className="font-medium">Data do pedido:</span>
                        <br />
                        {formatDate(order.date_created)}
                      </div>
                      <div>
                        <span className="font-medium">Total:</span>
                        <br />
                        <span className="text-lg font-semibold text-gray-900">
                          {formatCurrency(order.total, order.currency)}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Pagamento:</span>
                        <br />
                        {order.payment_method_title || "N/A"}
                      </div>
                    </div>

                    {/* Items Preview */}
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-sm text-gray-600">Itens:</span>
                      <div className="flex -space-x-2">
                        {order.line_items.slice(0, 3).map((item, itemIndex) => (
                          <div
                            key={item.id}
                            className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600"
                            title={item.name}>
                            {/* Adicionado console.log para depurar a imagem */}
                            {console.log(
                              `Item ${item.name} image:`,
                              item.image
                            )}
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={32} // Definir width e height para otimização
                                height={32}
                                className="object-cover rounded-full" // Usar rounded-full para as miniaturas
                              />
                            ) : (
                              // Fallback para quando não há imagem
                              <span className="text-gray-500">?</span>
                            )}
                          </div>
                        ))}
                        {order.line_items.length > 3 && (
                          <div className="w-8 h-8 bg-gray-100 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-gray-500">
                            +{order.line_items.length - 3}
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-gray-500">
                      {statusInfo.description}
                    </p>
                  </div>

                  <div className="mt-4 lg:mt-0 lg:ml-6">
                    <button
                      onClick={() =>
                        setSelectedOrder(
                          selectedOrder === order.id ? null : order.id
                        )
                      }
                      className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
                      <FiEye className="mr-2 h-4 w-4" />
                      {selectedOrder === order.id ? "Ocultar" : "Ver Detalhes"}
                    </button>
                  </div>
                </div>

                {/* Order Details */}
                {selectedOrder === order.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Itens do Pedido
                    </h4>
                    <div className="space-y-3">
                      {order.line_items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                          {item.image && (
                            <div className="w-16 h-16 relative">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover rounded-lg"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">
                              {item.name}
                            </h5>
                            <p className="text-sm text-gray-600">
                              Quantidade: {item.quantity} ×{" "}
                              {formatCurrency(item.price, order.currency)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              {formatCurrency(item.total, order.currency)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Shipping and Billing Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">
                          Endereço de Entrega
                        </h5>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>
                            {order.shipping.first_name}{" "}
                            {order.shipping.last_name}
                          </p>
                          <p>{order.shipping.address_1}</p>
                          {order.shipping.address_2 && (
                            <p>{order.shipping.address_2}</p>
                          )}
                          <p>
                            {order.shipping.city}, {order.shipping.state}{" "}
                            {order.shipping.postcode}
                          </p>
                          <p>{order.shipping.country}</p>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">
                          Endereço de Cobrança
                        </h5>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>
                            {order.billing.first_name} {order.billing.last_name}
                          </p>
                          <p>{order.billing.address_1}</p>
                          {order.billing.address_2 && (
                            <p>{order.billing.address_2}</p>
                          )}
                          <p>
                            {order.billing.city}, {order.billing.state}{" "}
                            {order.billing.postcode}
                          </p>
                          <p>{order.billing.country}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
