import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useState } from "react";
import { useAuth } from "../context/AuthContext"; // NOVO: Importa useAuth

export default function PayPalButton({
  amount,
  currency = "BRL",
  items = [],
  billingData,
  shippingData,
  sameAsShipping,
  selectedShipping,
  shippingCost,
  isEligibleForFreeShipping,
  onSuccess,
  onError,
  onCancel,
  disabled = false,
}) {
  const [{ isPending }] = usePayPalScriptReducer();
  const [loading, setLoading] = useState(false);
  const { customer, isAuthenticated } = useAuth(); // NOVO: Obtém customer e isAuthenticated

  const createOrder = async (data, actions) => {
    setLoading(true);
    try {
      const response = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          currency,
          items,
        }),
      });

      const orderData = await response.json();

      if (!response.ok) {
        throw new Error(orderData.message || "Erro ao criar pedido PayPal");
      }

      return orderData.id;
    } catch (error) {
      console.error("Error creating PayPal order:", error);
      if (onError) onError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const onApprove = async (data, actions) => {
    setLoading(true);
    try {
      const response = await fetch("/api/paypal/capture-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderID: data.orderID,
          items,
          billingData,
          shippingData,
          sameAsShipping,
          selectedShipping,
          shippingCost,
          isEligibleForFreeShipping,
          // NOVO: Passa o customer_id se o usuário estiver autenticado
          customer_id: isAuthenticated ? customer?.id : undefined,
        }),
      });

      const captureData = await response.json();

      if (!response.ok || !captureData.success) {
        throw new Error(captureData.message || "Erro ao processar pagamento");
      }

      if (onSuccess) {
        onSuccess({
          orderID: data.orderID,
          paymentID: captureData.paymentID,
          status: captureData.status,
          amount: captureData.amount,
          details: captureData.captureData,
          woocommerceOrderId: captureData.woocommerceOrderId,
          woocommerceOrderNumber: captureData.woocommerceOrderNumber,
        });
      }
    } catch (error) {
      console.error("Error capturing PayPal payment:", error);
      if (onError) onError(error);
    } finally {
      setLoading(false);
    }
  };

  const onErrorHandler = (err) => {
    console.error("PayPal error:", err);
    if (onError) onError(err);
  };

  const onCancelHandler = (data) => {
    console.log("PayPal payment cancelled:", data);
    if (onCancel) onCancel(data);
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Carregando PayPal...</span>
      </div>
    );
  }

  return (
    <div className="paypal-button-container">
      {loading && (
        <div className="flex justify-center items-center py-2 mb-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600">Processando...</span>
        </div>
      )}

      <PayPalButtons
        disabled={disabled || loading}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onErrorHandler}
        onCancel={onCancelHandler}
        style={{
          layout: "vertical",
          color: "blue",
          shape: "rect",
          label: "paypal",
          height: 45,
        }}
        forceReRender={[amount, currency, disabled]}
      />
    </div>
  );
}
