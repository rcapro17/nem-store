// pages/dashboard/index.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Cart from "../../components/Cart";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiShoppingBag,
  FiMapPin,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";

// Componentes das seções
import ProfileSection from "../../components/dashboard/ProfileSection";
import OrdersSection from "../../components/dashboard/OrdersSection";
import AddressesSection from "../../components/dashboard/AddressesSection";
import SettingsSection from "../../components/dashboard/SettingsSection";

export default function DashboardPage() {
  const router = useRouter();
  const { customer, isAuthenticated, logout, loading: loadingAuth } = useAuth();

  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Efeito para lidar com a proteção da rota
  useEffect(() => {
    if (!loadingAuth) {
      if (!isAuthenticated) {
        console.log(
          "DashboardPage: Usuário não autenticado ou sessão expirada. Redirecionando para /account."
        );
        router.push("/account");
      } else {
        console.log("DashboardPage: Usuário autenticado:", customer);
        // NOVO LOG: Inspecionar o objeto customer para ver as propriedades de nome
        console.log("DEBUG: Customer object in DashboardPage:", customer);
        if (customer) {
          console.log("DEBUG: customer.first_name:", customer.first_name);
          console.log("DEBUG: customer.last_name:", customer.last_name);
          console.log("DEBUG: customer.name (if any):", customer.name); // Para casos onde o nome completo vem em 'name'
          console.log(
            "DEBUG: customer.billing.first_name:",
            customer.billing?.first_name
          );
        }
      }
    }
  }, [isAuthenticated, loadingAuth, customer, router]);

  // Definir tab ativa baseada na query da URL
  useEffect(() => {
    const { tab } = router.query;
    if (tab && ["profile", "orders", "addresses", "settings"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [router.query]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSidebarOpen(false);
    router.push(`/dashboard?tab=${tabId}`, undefined, { shallow: true });
  };

  if (loadingAuth || (!isAuthenticated && !loadingAuth)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando sua conta...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const menuItems = [
    {
      id: "profile",
      label: "Meu Perfil",
      icon: FiUser,
      description: "Informações pessoais e dados da conta",
    },
    {
      id: "orders",
      label: "Meus Pedidos",
      icon: FiShoppingBag,
      description: "Histórico e status dos seus pedidos",
    },
    {
      id: "addresses",
      label: "Endereços",
      icon: FiMapPin,
      description: "Gerencie seus endereços de entrega",
    },
    {
      id: "settings",
      label: "Configurações",
      icon: FiSettings,
      description: "Preferências e configurações da conta",
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSection customer={customer} />;
      case "orders":
        return <OrdersSection customerId={customer.id} />;
      case "addresses":
        return <AddressesSection customer={customer} />;
      case "settings":
        return <SettingsSection customer={customer} />;
      default:
        return <ProfileSection customer={customer} />;
    }
  };

  // Lógica para determinar o nome a ser exibido
  const displayFirstName =
    customer?.first_name || customer?.billing?.first_name || customer?.name;
  const displayLastName = customer?.last_name || customer?.billing?.last_name;
  const displayName = displayFirstName || "Usuário"; // Fallback final

  return (
    <>
      <Head>
        <title>Minha Conta • Nem Store</title>
        <meta
          name="description"
          content="Gerencie sua conta, pedidos e preferências"
        />
      </Head>

      <Header />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm border-b pt-20">
          <div className="px-4 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Olá, {displayName}!{" "}
              </h1>
              <p className="text-sm text-gray-600">Gerencie sua conta</p>
            </div>
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
              <FiMenu className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 lg:pt-28">
          <div className="max-w-7xl mx-auto">
            {/* Desktop Header */}
            <div className="hidden lg:block mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}>
                <h1 className="text-4xl font-light text-gray-900 mb-2">
                  Olá, {displayName}!{" "}
                </h1>
                <p className="text-lg text-gray-600">
                  Gerencie sua conta e acompanhe seus pedidos
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Desktop Sidebar */}
              <div className="hidden lg:block lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  {/* User Info */}
                  <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <div className="flex items-center">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-semibold text-xl">
                        {(displayFirstName || "U")[0].toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <p className="font-semibold text-lg">
                          {displayFirstName} {displayLastName}
                        </p>
                        <p className="text-white/80 text-sm">
                          {customer?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Navigation */}
                  <nav className="p-2">
                    {menuItems.map((item, index) => (
                      <motion.button
                        key={item.id}
                        onClick={() => handleTabChange(item.id)}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                        className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all duration-200 mb-1 group ${
                          activeTab === item.id
                            ? "bg-blue-50 text-blue-600 shadow-sm"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}>
                        <item.icon
                          className={`mr-3 h-5 w-5 transition-colors ${
                            activeTab === item.id
                              ? "text-blue-600"
                              : "text-gray-500 group-hover:text-gray-700"
                          }`}
                        />
                        <div>
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {item.description}
                          </div>
                        </div>
                      </motion.button>
                    ))}

                    <div className="border-t border-gray-100 mt-4 pt-4">
                      <button
                        onClick={handleLogout}
                        disabled={loading}
                        className="w-full flex items-center px-4 py-3 rounded-xl text-left text-red-600 hover:bg-red-50 transition-all duration-200 disabled:opacity-50 group">
                        <FiLogOut className="mr-3 h-5 w-5 text-red-500 group-hover:text-red-600" />
                        <div>
                          <div className="font-medium">
                            {loading ? "Saindo..." : "Sair"}
                          </div>
                          <div className="text-xs text-red-400 mt-0.5">
                            Encerrar sessão
                          </div>
                        </div>
                      </button>
                    </div>
                  </nav>
                </motion.div>
              </div>

              {/* Mobile Sidebar */}
              <AnimatePresence>
                {sidebarOpen && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                      onClick={() => setSidebarOpen(false)}
                    />
                    <motion.div
                      initial={{ x: -300 }}
                      animate={{ x: 0 }}
                      exit={{ x: -300 }}
                      transition={{
                        type: "spring",
                        damping: 25,
                        stiffness: 200,
                      }}
                      className="fixed left-0 top-0 h-full w-80 bg-white z-50 lg:hidden shadow-2xl">
                      <div className="p-6 border-b">
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-xl font-semibold text-gray-900">
                            Menu
                          </h2>
                          <button
                            onClick={() => setSidebarOpen(false)}
                            className="p-2 rounded-lg hover:bg-gray-100">
                            <FiX className="w-6 h-6 text-gray-500" />
                          </button>
                        </div>

                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {(displayFirstName || "U")[0].toUpperCase()}
                          </div>
                          <div className="ml-3">
                            <p className="font-semibold text-gray-900">
                              {displayFirstName} {displayLastName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {customer?.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <nav className="p-4">
                        {menuItems.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleTabChange(item.id)}
                            className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-colors mb-2 ${
                              activeTab === item.id
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}>
                            <item.icon className="mr-3 h-5 w-5" />
                            <div>
                              <div className="font-medium">{item.label}</div>
                              <div className="text-xs text-gray-500 mt-0.5">
                                {item.description}
                              </div>
                            </div>
                          </button>
                        ))}

                        <div className="border-t border-gray-100 mt-4 pt-4">
                          <button
                            onClick={handleLogout}
                            disabled={loading}
                            className="w-full flex items-center px-4 py-3 rounded-xl text-left text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50">
                            <FiLogOut className="mr-3 h-5 w-5" />
                            <div>
                              <div className="font-medium">
                                {loading ? "Saindo..." : "Sair"}
                              </div>
                              <div className="text-xs text-red-400 mt-0.5">
                                Encerrar sessão
                              </div>
                            </div>
                          </button>
                        </div>
                      </nav>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              {/* Main Content */}
              <div className="lg:col-span-4">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  {renderContent()}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <Cart />
    </>
  );
}
