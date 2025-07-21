// components/dashboard/AddressesSection.jsx
"use client";

import { useState, useEffect } from "react"; // Adicionado useEffect para logs
import { motion } from "framer-motion";
import {
  FiMapPin,
  FiEdit3,
  FiSave,
  FiTruck,
  FiX,
  FiPlus,
  FiHome,
  FiBuilding,
} from "react-icons/fi";
import { toast } from "react-hot-toast"; // Verifique se você está usando react-hot-toast ou react-toastify globalmente

export default function AddressesSection({ customer }) {
  const [isEditingBilling, setIsEditingBilling] = useState(false);
  const [isEditingShipping, setIsEditingShipping] = useState(false);
  const [loading, setLoading] = useState(false);

  // Inicializa os dados com base no customer recebido
  const [billingData, setBillingData] = useState({
    first_name: customer?.billing?.first_name || "",
    last_name: customer?.billing?.last_name || "",
    company: customer?.billing?.company || "",
    address_1: customer?.billing?.address_1 || "",
    address_2: customer?.billing?.address_2 || "",
    city: customer?.billing?.city || "",
    state: customer?.billing?.state || "",
    postcode: customer?.billing?.postcode || "",
    country: customer?.billing?.country || "BR",
    email: customer?.billing?.email || customer?.email || "",
    phone: customer?.billing?.phone || customer?.phone || "",
  });

  const [shippingData, setShippingData] = useState({
    first_name: customer?.shipping?.first_name || "",
    last_name: customer?.shipping?.last_name || "",
    company: customer?.shipping?.company || "",
    address_1: customer?.shipping?.address_1 || "",
    address_2: customer?.shipping?.address_2 || "",
    city: customer?.shipping?.city || "",
    state: customer?.shipping?.state || "",
    postcode: customer?.shipping?.postcode || "",
    country: customer?.shipping?.country || "BR",
  });

  useEffect(() => {
    // Log para depuração: verificar se o customer está sendo passado corretamente
    console.log("AddressesSection: Customer data received:", customer);
    // Atualiza os estados locais se o customer mudar (ex: após login ou atualização)
    setBillingData({
      first_name: customer?.billing?.first_name || "",
      last_name: customer?.billing?.last_name || "",
      company: customer?.billing?.company || "",
      address_1: customer?.billing?.address_1 || "",
      address_2: customer?.billing?.address_2 || "",
      city: customer?.billing?.city || "",
      state: customer?.billing?.state || "",
      postcode: customer?.billing?.postcode || "",
      country: customer?.billing?.country || "BR",
      email: customer?.billing?.email || customer?.email || "",
      phone: customer?.billing?.phone || customer?.phone || "",
    });
    setShippingData({
      first_name: customer?.shipping?.first_name || "",
      last_name: customer?.shipping?.last_name || "",
      company: customer?.shipping?.company || "",
      address_1: customer?.shipping?.address_1 || "",
      address_2: customer?.shipping?.address_2 || "",
      city: customer?.shipping?.city || "",
      state: customer?.shipping?.state || "",
      postcode: customer?.shipping?.postcode || "",
      country: customer?.shipping?.country || "BR",
    });
  }, [customer]);

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveBillingAddress = async () => {
    setLoading(true);
    try {
      // Certifique-se de que customer.id existe antes de fazer a requisição
      if (!customer?.id) {
        toast.error("ID do cliente não disponível para salvar endereço.");
        return;
      }
      const response = await fetch(`/api/customers/${customer.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          billing: billingData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erro ao atualizar endereço de cobrança"
        );
      }

      toast.success("Endereço de cobrança atualizado com sucesso!");
      setIsEditingBilling(false);
      // Opcional: Recarregar dados do customer no AuthContext se a atualização for bem-sucedida
      // Isso dependeria de como seu AuthContext lida com a atualização de dados do usuário.
    } catch (error) {
      console.error("Erro ao atualizar endereço de cobrança:", error);
      toast.error("Erro ao atualizar endereço de cobrança: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const saveShippingAddress = async () => {
    setLoading(true);
    try {
      // Certifique-se de que customer.id existe antes de fazer a requisição
      if (!customer?.id) {
        toast.error("ID do cliente não disponível para salvar endereço.");
        return;
      }
      const response = await fetch(`/api/customers/${customer.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shipping: shippingData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erro ao atualizar endereço de entrega"
        );
      }

      toast.success("Endereço de entrega atualizado com sucesso!");
      setIsEditingShipping(false);
      // Opcional: Recarregar dados do customer no AuthContext se a atualização for bem-sucedida
    } catch (error) {
      console.error("Erro ao atualizar endereço de entrega:", error);
      toast.error("Erro ao atualizar endereço de entrega: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyBillingToShipping = () => {
    setShippingData({
      first_name: billingData.first_name,
      last_name: billingData.last_name,
      company: billingData.company,
      address_1: billingData.address_1,
      address_2: billingData.address_2,
      city: billingData.city,
      state: billingData.state,
      postcode: billingData.postcode,
      country: billingData.country,
    });
    toast.success("Endereço de cobrança copiado para entrega!");
  };

  const renderAddressForm = (data, onChange, isEditing, type) => {
    const isBilling = type === "billing";

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome
          </label>
          {isEditing ? (
            <input
              type="text"
              name="first_name"
              value={data.first_name}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nome"
            />
          ) : (
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
              {data.first_name || "Não informado"}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sobrenome
          </label>
          {isEditing ? (
            <input
              type="text"
              name="last_name"
              value={data.last_name}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Sobrenome"
            />
          ) : (
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
              {data.last_name || "Não informado"}
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Empresa (opcional)
          </label>
          {isEditing ? (
            <input
              type="text"
              name="company"
              value={data.company}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nome da empresa"
            />
          ) : (
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
              {data.company || "Não informado"}
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Endereço
          </label>
          {isEditing ? (
            <input
              type="text"
              name="address_1"
              value={data.address_1}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Rua, número"
            />
          ) : (
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
              {data.address_1 || "Não informado"}
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Complemento (opcional)
          </label>
          {isEditing ? (
            <input
              type="text"
              name="address_2"
              value={data.address_2}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Apartamento, bloco, etc."
            />
          ) : (
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
              {data.address_2 || "Não informado"}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cidade
          </label>
          {isEditing ? (
            <input
              type="text"
              name="city"
              value={data.city}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Cidade"
            />
          ) : (
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
              {data.city || "Não informado"}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado
          </label>
          {isEditing ? (
            <input
              type="text"
              name="state"
              value={data.state}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Estado"
            />
          ) : (
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
              {data.state || "Não informado"}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CEP
          </label>
          {isEditing ? (
            <input
              type="text"
              name="postcode"
              value={data.postcode}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="00000-000"
            />
          ) : (
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
              {data.postcode || "Não informado"}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            País
          </label>
          {isEditing ? (
            <select
              name="country"
              value={data.country}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="BR">Brasil</option>
              <option value="US">Estados Unidos</option>
              <option value="AR">Argentina</option>
              <option value="UY">Uruguai</option>
              <option value="PY">Paraguai</option>
            </select>
          ) : (
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
              {data.country === "BR"
                ? "Brasil"
                : data.country || "Não informado"}
            </div>
          )}
        </div>

        {isBilling && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={onChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="seu@email.com"
                />
              ) : (
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                  {data.email || "Não informado"}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={data.phone}
                  onChange={onChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="(11) 99999-9999"
                />
              ) : (
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                  {data.phone || "Não informado"}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl lg:text-3xl font-light text-gray-900 mb-2">
          Meus Endereços
        </h2>
        <p className="text-gray-600">
          Gerencie seus endereços de cobrança e entrega
        </p>
      </div>

      <div className="space-y-8">
        {/* Billing Address */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <FiHome className="mr-2 text-blue-600" />
              Endereço de Cobrança
            </h3>
            {isEditingBilling ? (
              <div className="flex space-x-2">
                <button
                  onClick={saveBillingAddress}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center">
                  <FiSave className="mr-2" />
                  {loading ? "Salvando..." : "Salvar"}
                </button>
                <button
                  onClick={() => setIsEditingBilling(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                  <FiX className="mr-2" />
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingBilling(true)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center">
                <FiEdit3 className="mr-2" />
                Editar
              </button>
            )}
          </div>

          {renderAddressForm(
            billingData,
            handleBillingChange,
            isEditingBilling,
            "billing"
          )}
        </motion.div>

        {/* Shipping Address */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <FiTruck className="mr-2 text-purple-600" />
              Endereço de Entrega
            </h3>
            {isEditingShipping ? (
              <div className="flex space-x-2">
                <button
                  onClick={saveShippingAddress}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center">
                  <FiSave className="mr-2" />
                  {loading ? "Salvando..." : "Salvar"}
                </button>
                <button
                  onClick={() => setIsEditingShipping(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                  <FiX className="mr-2" />
                  Cancelar
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={copyBillingToShipping}
                  className="px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors flex items-center">
                  <FiPlus className="mr-2" />
                  Copiar de Cobrança
                </button>
                <button
                  onClick={() => setIsEditingShipping(true)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center">
                  <FiEdit3 className="mr-2" />
                  Editar
                </button>
              </div>
            )}
          </div>

          {renderAddressForm(
            shippingData,
            handleShippingChange,
            isEditingShipping,
            "shipping"
          )}
        </motion.div>
      </div>
    </div>
  );
}
