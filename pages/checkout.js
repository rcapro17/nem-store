import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import PayPalButton from "../components/PayPalButton";
import AddressForm from "../components/AddressForm";
import {
  FiArrowLeft,
  FiShoppingBag,
  FiTruck,
  FiCreditCard,
  FiCheck,
  FiXCircle,
} from "react-icons/fi";

// Configuração do PayPal
// Adicionado log para verificar o CLIENT_ID
console.log("PayPal Client ID:", process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID);
const paypalOptions = {
  "client-id":
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ||
    "AVJ5Wu4Rr7uOu2vedJR9r1galCptWrLtRvDFPb-L4NxT35fEpxqdyP0HZ3gVIOLK_NIfiULgMG_uIDrB",
  currency: "BRL",
  intent: "capture",
  locale: "pt_BR",
};

export default function Checkout() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCart();
  const { customer, isAuthenticated, login, register } = useAuth();

  const [currentStep, setCurrentStep] = useState(1); // 1: Login, 2: Endereço, 3: Frete, 4: Pagamento
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Estados para login/cadastro
  const [authMode, setAuthMode] = useState("login"); // 'login' ou 'register'
  const [authData, setAuthData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });

  // Estados para endereço
  const [billingData, setBillingData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address_1: "",
    address_2: "",
    city: "",
    state: "",
    postcode: "",
    country: "BR",
  });

  const [shippingData, setShippingData] = useState({
    first_name: "",
    last_name: "",
    address_1: "",
    address_2: "",
    city: "",
    state: "",
    postcode: "",
    country: "BR",
  });

  const [sameAsShipping, setSameAsShipping] = useState(true);

  // Estados para frete
  const [shippingMethods, setShippingMethods] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [shippingCost, setShippingCost] = useState(0);

  // NOVO: Estados para o modal de confirmação
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationDetails, setConfirmationDetails] = useState(null);

  const subtotal = getTotalPrice();
  const freeShippingThreshold = 500;
  const isEligibleForFreeShipping = subtotal >= freeShippingThreshold;
  const total = subtotal + (isEligibleForFreeShipping ? 0 : shippingCost);

  // Redirecionar se carrinho vazio - Ajustado para não redirecionar se o modal de confirmação estiver ativo
  useEffect(() => {
    console.log(
      "CheckoutPage useEffect: items.length =",
      items.length,
      "showConfirmationModal =",
      showConfirmationModal
    );
    if (items.length === 0 && !showConfirmationModal) {
      console.log(
        "CheckoutPage: Cart is empty and no confirmation modal, redirecting to /products."
      );
      router.push("/products");
    }
  }, [items, router, showConfirmationModal]);

  // Carregar dados do usuário se logado
  useEffect(() => {
    console.log(
      "CheckoutPage useEffect: isAuthenticated =",
      isAuthenticated,
      "customer =",
      customer
    );
    if (isAuthenticated && customer) {
      console.log(
        "CheckoutPage: User is authenticated, setting current step to 2 (Address)."
      );
      setCurrentStep(2); // Pular para endereço se já logado
      setBillingData({
        first_name: customer.first_name || "",
        last_name: customer.last_name || "",
        email: customer.email || "",
        phone: customer.billing?.phone || "", // Pegar telefone do billing se existir
        address_1: customer.billing?.address_1 || "",
        address_2: customer.billing?.address_2 || "",
        city: customer.billing?.city || "",
        state: customer.billing?.state || "",
        postcode: customer.billing?.postcode || "",
        country: "BR",
      });
    }
  }, [isAuthenticated, customer]);

  // Sincronizar endereços quando sameAsShipping mudar
  useEffect(() => {
    if (sameAsShipping) {
      setShippingData({
        first_name: billingData.first_name,
        last_name: billingData.last_name,
        address_1: billingData.address_1,
        address_2: billingData.address_2,
        city: billingData.city,
        state: billingData.state,
        postcode: billingData.postcode,
        country: billingData.country,
      });
    }
  }, [sameAsShipping, billingData]);

  // Calcular frete quando endereço mudar
  useEffect(() => {
    console.log("DEBUG: useEffect para calcular frete acionado.");
    console.log(
      "DEBUG: currentStep:",
      currentStep,
      "shippingData.postcode:",
      shippingData.postcode,
      "isEligibleForFreeShipping:",
      isEligibleForFreeShipping
    );

    if (
      currentStep >= 3 && // Está na etapa de frete ou posterior
      shippingData.postcode // Tem um CEP para calcular
    ) {
      console.log("CheckoutPage: Calling calculateShipping...");
      calculateShipping();
    } else if (currentStep >= 3 && isEligibleForFreeShipping) {
      // Se for elegível para frete grátis, garante que nenhum método pago esteja selecionado
      setSelectedShipping({
        id: "free_shipping",
        title: "Frete Grátis",
        cost: "0.00",
      });
      setShippingCost(0);
      setShippingMethods([
        {
          id: "free_shipping",
          title: "Frete Grátis",
          description: "Frete Grátis",
          cost: "0.00",
        },
      ]);
      setError("");
      setLoading(false);
    }
  }, [currentStep, shippingData.postcode, isEligibleForFreeShipping, items]);

  // NOVO: Log de depuração para subtotal e isEligibleForFreeShipping na Etapa 3
  useEffect(() => {
    if (currentStep === 3) {
      console.log("DEBUG: Step 3 (Frete) - Subtotal:", subtotal);
      console.log(
        "DEBUG: Step 3 (Frete) - isEligibleForFreeShipping:",
        isEligibleForFreeShipping
      );
      console.log(
        "DEBUG: Step 3 (Frete) - Current shippingMethods:",
        shippingMethods
      );
      console.log(
        "DEBUG: Step 3 (Frete) - Current selectedShipping:",
        selectedShipping
      );
    }
  }, [
    currentStep,
    subtotal,
    isEligibleForFreeShipping,
    shippingMethods,
    selectedShipping,
  ]);

  const calculateShipping = async () => {
    try {
      setLoading(true);
      setError(""); // Limpa erros anteriores
      console.log(
        "DEBUG: calculateShipping - Subtotal antes da chamada da API:",
        subtotal
      );
      console.log(
        "DEBUG: calculateShipping - isEligibleForFreeShipping antes da chamada da API:",
        isEligibleForFreeShipping
      );

      const response = await fetch("/api/shipping/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postcode: shippingData.postcode,
          items: items.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
            weight: item.weight || 0.5,
            dimensions: item.dimensions || { length: 20, width: 15, height: 5 },
          })),
          cart_subtotal: subtotal,
          free_shipping_threshold: freeShippingThreshold, // Passa o limite para a API
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(
          "DEBUG: calculateShipping - Resposta bruta da API de frete:",
          data
        );

        // NOVO: Filtra métodos de frete para remover "frete grátis" se o subtotal for menor que o limite
        // Esta filtragem é uma camada de segurança. O ideal é que a API já retorne filtrado.
        const filteredMethods = data.methods.filter((method) => {
          // Verifica se o método é 'free_shipping' e se o subtotal está abaixo do limite
          if (
            method.id === "free_shipping" &&
            subtotal < freeShippingThreshold
          ) {
            return false; // Remove a opção de frete grátis
          }
          return true;
        });

        console.log(
          "DEBUG: calculateShipping - Métodos de frete filtrados (no frontend):",
          filteredMethods
        );

        setShippingMethods(filteredMethods || []);
        if (filteredMethods && filteredMethods.length > 0) {
          // Se o método selecionado anteriormente era frete grátis e agora não é mais elegível,
          // ou se não havia seleção, seleciona o primeiro método disponível.
          if (
            !isEligibleForFreeShipping &&
            selectedShipping?.id === "free_shipping"
          ) {
            setSelectedShipping(filteredMethods[0]);
            setShippingCost(parseFloat(filteredMethods[0].cost));
          } else if (!selectedShipping) {
            // Se não havia seleção anterior
            setSelectedShipping(filteredMethods[0]);
            setShippingCost(parseFloat(filteredMethods[0].cost));
          } else {
            // Mantém a seleção existente se ainda estiver nos filteredMethods
            const currentSelectionStillAvailable = filteredMethods.find(
              (m) => m.id === selectedShipping.id
            );
            if (currentSelectionStillAvailable) {
              setSelectedShipping(currentSelectionStillAvailable);
              setShippingCost(parseFloat(currentSelectionStillAvailable.cost));
            } else {
              // Se a seleção anterior não está mais disponível, seleciona a primeira
              setSelectedShipping(filteredMethods[0]);
              setShippingCost(parseFloat(filteredMethods[0].cost));
            }
          }
        } else {
          setSelectedShipping(null);
          setShippingCost(0);
          setError("Não foi possível calcular o frete para o CEP informado.");
        }
        console.log(
          "DEBUG: calculateShipping - selectedShipping após cálculo:",
          selectedShipping
        );
        console.log(
          "DEBUG: calculateShipping - shippingCost após cálculo:",
          shippingCost
        );
      } else {
        const errorData = await response.json();
        console.error(
          "CheckoutPage: Error calculating shipping API response:",
          errorData
        );
        throw new Error(errorData.message || "Erro ao calcular frete");
      }
    } catch (error) {
      console.error("CheckoutPage: Erro ao calcular frete:", error);
      setError(
        error.message ||
          "Erro ao calcular frete. Verifique o CEP ou tente novamente."
      );
      // Fallback com métodos padrão (apenas para desenvolvimento/demonstração)
      const fallbackMethods = [
        {
          id: "pac",
          title: "PAC",
          description: "8-12 dias úteis",
          cost: "15.00",
        },
        {
          id: "sedex",
          title: "SEDEX",
          description: "3-5 dias úteis",
          cost: "25.00",
        },
      ];
      setShippingMethods(fallbackMethods);
      setSelectedShipping(fallbackMethods[0]);
      setShippingCost(parseFloat(fallbackMethods[0].cost));
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let result;
      if (authMode === "login") {
        result = await login(authData.email, authData.password);
      } else {
        result = await register(authData);
      }

      if (result.success) {
        setCurrentStep(2); // Avança para o passo de endereço
      } else {
        setError(result.error || "Erro na autenticação");
      }
    } catch (error) {
      setError(error.message || "Erro na autenticação");
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    // Validações antes de avançar
    if (currentStep === 1 && !isAuthenticated) {
      setError("Por favor, faça login ou crie uma conta para continuar.");
      return;
    }
    if (currentStep === 2) {
      if (
        !billingData.first_name ||
        !billingData.last_name ||
        !billingData.email ||
        !billingData.address_1 ||
        !billingData.city ||
        !billingData.state ||
        !billingData.postcode
      ) {
        setError(
          "Por favor, preencha todos os campos obrigatórios de endereço de cobrança."
        );
        return;
      }
      if (
        !sameAsShipping &&
        (!shippingData.first_name ||
          !shippingData.last_name ||
          !shippingData.address_1 ||
          !shippingData.city ||
          !shippingData.state ||
          !shippingData.postcode)
      ) {
        setError(
          "Por favor, preencha todos os campos obrigatórios do endereço de entrega."
        );
        return;
      }
    }
    if (currentStep === 3) {
      // Se não for elegível para frete grátis, exige a seleção de um método de frete
      // E verifica se o método selecionado NÃO É frete grátis
      if (
        !isEligibleForFreeShipping &&
        (!selectedShipping || selectedShipping.id === "free_shipping")
      ) {
        setError("Por favor, selecione um método de frete pago.");
        return;
      }
      // Se for elegível para frete grátis, não precisa de selectedShipping (já é 0)
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      setError(""); // Limpa erros ao avançar
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(""); // Limpa erros ao voltar
    }
  };

  const handleShippingSelect = (method) => {
    setSelectedShipping(method);
    setShippingCost(parseFloat(method.cost));
  };

  const handlePaymentSuccess = (details) => {
    console.log(
      "Pagamento PayPal Aprovado e Pedido WooCommerce Criado:",
      details
    );
    setConfirmationDetails(details);
    setShowConfirmationModal(true);
    clearCart();
    setError("");
  };

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
    setConfirmationDetails(null);
    router.push("/dashboard/orders"); // Redireciona para a página de "Meus Pedidos"
  };

  const steps = [
    { id: 1, title: "Login", icon: FiShoppingBag },
    { id: 2, title: "Endereço", icon: FiTruck },
    { id: 3, title: "Frete", icon: FiTruck },
    { id: 4, title: "Pagamento", icon: FiCreditCard },
  ];

  // Modificado: Se o carrinho está vazio E não há modal de confirmação ativo, retorne null para evitar renderização desnecessária antes do redirect
  if (items.length === 0 && !showConfirmationModal) {
    return null; // Next.js fará o redirecionamento via useEffect
  }

  return (
    <PayPalScriptProvider options={paypalOptions}>
      <Head>
        <title>Checkout • Nem Store</title>
      </Head>

      <div className="min-h-screen bg-gray-50 pt-20 font-poppins">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center mb-8">
            <Link
              href="/products"
              className="flex items-center text-blue-600 hover:text-blue-800">
              <FiArrowLeft className="mr-2" />
              Continuar Comprando
            </Link>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      currentStep >= step.id
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "border-gray-300 text-gray-400"
                    }`}>
                    {currentStep > step.id ? (
                      <FiCheck className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      currentStep >= step.id ? "text-blue-600" : "text-gray-400"
                    }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-16 h-0.5 mx-4 ${
                        currentStep > step.id ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulário Principal */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                {/* Step 1: Login/Cadastro */}
                {currentStep === 1 && !isAuthenticated && (
                  <div>
                    <h2 className="text-xl font-bebas-neue mb-6">
                      IDENTIFICAÇÃO
                    </h2>

                    <div className="flex mb-6">
                      <button
                        onClick={() => setAuthMode("login")}
                        className={`flex-1 py-2 px-4 text-center border-b-2 ${
                          authMode === "login"
                            ? "border-blue-600 text-white" // Corrigido para texto branco
                            : "border-gray-300 text-gray-600"
                        }`}>
                        Já tenho conta
                      </button>
                      <button
                        onClick={() => setAuthMode("register")}
                        className={`flex-1 py-2 px-4 text-center border-b-2 ${
                          authMode === "register"
                            ? "border-blue-600 text-white" // Corrigido para texto branco
                            : "border-gray-300 text-gray-600"
                        }`}>
                        Criar conta
                      </button>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-4">
                      {authMode === "register" && (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nome *
                              </label>
                              <input
                                type="text"
                                value={authData.first_name}
                                onChange={(e) =>
                                  setAuthData({
                                    ...authData,
                                    first_name: e.target.value,
                                  })
                                }
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Sobrenome *
                              </label>
                              <input
                                type="text"
                                value={authData.last_name}
                                onChange={(e) =>
                                  setAuthData({
                                    ...authData,
                                    last_name: e.target.value,
                                  })
                                }
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                        </>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          E-mail *
                        </label>
                        <input
                          type="email"
                          value={authData.email}
                          onChange={(e) =>
                            setAuthData({ ...authData, email: e.target.value })
                          }
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Senha *
                        </label>
                        <input
                          type="password"
                          value={authData.password}
                          onChange={(e) =>
                            setAuthData({
                              ...authData,
                              password: e.target.value,
                            })
                          }
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 font-bebas-neue text-lg tracking-wide">
                        {loading
                          ? "PROCESSANDO..."
                          : authMode === "login"
                          ? "ENTRAR"
                          : "CRIAR CONTA"}
                      </button>
                    </form>
                  </div>
                )}

                {/* Step 2: Endereço */}
                {currentStep === 2 && (
                  <div>
                    <h2 className="text-xl font-bebas-neue mb-6">
                      ENDEREÇO DE ENTREGA
                    </h2>

                    <AddressForm
                      data={billingData}
                      onChange={setBillingData}
                      title="Endereço de Cobrança"
                      showEmail={!isAuthenticated}
                      showPhone={true}
                    />

                    <div className="mt-6">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={sameAsShipping}
                          onChange={(e) => setSameAsShipping(e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">
                          Endereço de entrega é o mesmo da cobrança
                        </span>
                      </label>
                    </div>

                    {!sameAsShipping && (
                      <div className="mt-6">
                        <AddressForm
                          data={shippingData}
                          onChange={setShippingData}
                          title="Endereço de Entrega"
                        />
                      </div>
                    )}

                    <div className="flex justify-between mt-6">
                      <button
                        onClick={handlePrevStep}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                        Voltar
                      </button>
                      <button
                        onClick={handleNextStep}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-bebas-neue tracking-wide">
                        CONTINUAR
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Frete */}
                {currentStep === 3 && (
                  <div>
                    <h2 className="text-xl font-bebas-neue mb-6">
                      ESCOLHA O FRETE
                    </h2>

                    {loading ? (
                      <div className="flex justify-center items-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-gray-600">
                          Calculando frete...
                        </span>
                      </div>
                    ) : isEligibleForFreeShipping ? (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-md mb-4">
                        <p className="text-green-800 font-semibold">
                          🎉 Parabéns! Você ganhou frete grátis!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {shippingMethods.length > 0 ? (
                          shippingMethods.map((method, index) => (
                            <label
                              key={method.id || index} // Usar method.id como key se disponível
                              className="flex items-center p-4 border rounded-md cursor-pointer hover:bg-gray-50">
                              <input
                                type="radio"
                                name="shipping"
                                checked={selectedShipping?.id === method.id}
                                onChange={() => handleShippingSelect(method)}
                                className="mr-3"
                              />
                              <div className="flex-1">
                                <div className="font-medium">
                                  {method.title}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {method.description}
                                </div>
                              </div>
                              <div className="font-semibold">
                                R$ {parseFloat(method.cost).toFixed(2)}
                              </div>
                            </label>
                          ))
                        ) : (
                          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                            <p className="text-yellow-800">
                              Nenhuma opção de frete disponível para o CEP
                              informado.
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex justify-between mt-6">
                      <button
                        onClick={handlePrevStep}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                        Voltar
                      </button>
                      <button
                        onClick={handleNextStep}
                        disabled={
                          !isEligibleForFreeShipping && !selectedShipping
                        }
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 font-bebas-neue tracking-wide">
                        CONTINUAR
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 4: Pagamento */}
                {currentStep === 4 && (
                  <div>
                    <h2 className="text-xl font-bebas-neue mb-6">PAGAMENTO</h2>

                    <div className="mb-6">
                      <p className="text-gray-600 mb-4">
                        Finalize seu pedido com segurança através do PayPal
                      </p>
                      {/* Adicionado log para verificar se o PayPalButton está sendo renderizado */}
                      {console.log(
                        "DEBUG: Rendering PayPalButton. Total:",
                        total
                      )}
                      <PayPalButton
                        amount={total}
                        currency="BRL"
                        items={items.map((item) => ({
                          name: item.title,
                          price: item.price,
                          quantity: item.quantity,
                          id: item.id,
                          variation_id: item.variation_id,
                          selectedSize: item.selectedSize,
                          selectedColor: item.selectedColor,
                        }))}
                        billingData={billingData}
                        shippingData={shippingData}
                        sameAsShipping={sameAsShipping}
                        selectedShipping={selectedShipping}
                        shippingCost={shippingCost}
                        isEligibleForFreeShipping={isEligibleForFreeShipping}
                        onSuccess={handlePaymentSuccess}
                        onError={(error) => {
                          console.error("Erro no pagamento:", error);
                          setError(
                            error.message ||
                              "Houve um erro com seu pagamento. Por favor, tente novamente."
                          );
                        }}
                        onCancel={() => {
                          console.log("Pagamento cancelado pelo usuário");
                          setError("O pagamento foi cancelado pelo usuário.");
                        }}
                        disabled={loading}
                      />
                    </div>

                    <div className="flex justify-between mt-6">
                      <button
                        onClick={handlePrevStep}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        disabled={loading}>
                        Voltar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Resumo do Pedido */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h3 className="text-lg font-bebas-neue mb-4">
                  RESUMO DO PEDIDO
                </h3>

                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div
                      key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                      className="flex items-center">
                      <img
                        src={item.image || "/placeholder-image.png"}
                        alt={item.title}
                        className="w-12 h-12 object-cover rounded mr-3"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{item.title}</div>
                        <div className="text-xs text-gray-600">
                          {item.selectedSize && `Tamanho: ${item.selectedSize}`}
                          {item.selectedSize && item.selectedColor && " | "}
                          {item.selectedColor && `Cor: ${item.selectedColor}`}
                        </div>
                        <div className="text-xs text-gray-600">
                          Qtd: {item.quantity}
                        </div>
                      </div>
                      <div className="text-sm font-semibold">
                        R$ {(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Frete:</span>
                    <span
                      className={
                        isEligibleForFreeShipping
                          ? "text-green-600 font-semibold"
                          : ""
                      }>
                      {isEligibleForFreeShipping
                        ? "Grátis"
                        : `R$ ${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span>R$ {total.toFixed(2)}</span>
                  </div>
                </div>

                {!isEligibleForFreeShipping && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-blue-800 text-sm">
                      Faltam R$ {(freeShippingThreshold - subtotal).toFixed(2)}{" "}
                      para frete grátis
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NOVO: Modal de Confirmação de Compra */}
      {showConfirmationModal && confirmationDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center relative">
            <button
              onClick={handleCloseConfirmationModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
              <FiXCircle className="w-6 h-6" />
            </button>
            <h2 className="text-3xl font-bold text-green-600 mb-4">
              Compra Confirmada!
            </h2>
            <p className="text-gray-700 mb-2">
              Seu pedido foi realizado com sucesso.
            </p>

            {confirmationDetails.woocommerceOrderNumber && (
              <p className="text-lg font-semibold text-gray-800 mb-4">
                Número do Pedido:{" "}
                <span className="text-indigo-600">
                  {confirmationDetails.woocommerceOrderNumber}
                </span>
              </p>
            )}

            {confirmationDetails.amount && (
              <p className="text-gray-700 mb-2">
                Valor Total:{" "}
                <span className="font-semibold">
                  R${" "}
                  {parseFloat(confirmationDetails.amount)
                    .toFixed(2)
                    .replace(".", ",")}
                </span>
              </p>
            )}

            <p className="text-sm text-gray-500 mt-6">
              Um e-mail de confirmação com os detalhes completos do seu pedido
              foi enviado para o seu endereço de e-mail.
            </p>
            <button
              onClick={handleCloseConfirmationModal}
              className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition-colors text-lg">
              Ir para Meus Pedidos
            </button>
          </div>
        </div>
      )}
    </PayPalScriptProvider>
  );
}
