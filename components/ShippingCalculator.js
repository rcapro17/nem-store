// components/ShippingCalculator.js
import { useState } from "react";
import { FiTruck, FiLoader } from "react-icons/fi";

export default function ShippingCalculator({ productId, quantity = 1 }) {
  const [postcode, setPostcode] = useState("");
  const [loading, setLoading] = useState(false);
  const [shippingOptions, setShippingOptions] = useState([]);
  const [error, setError] = useState("");

  const formatCEP = (value) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, "");
    
    // Aplica a máscara 00000-000
    if (numbers.length <= 5) {
      return numbers;
    } else {
      return numbers.slice(0, 5) + "-" + numbers.slice(5, 8);
    }
  };

  const handleCEPChange = (e) => {
    const formatted = formatCEP(e.target.value);
    setPostcode(formatted);
    setError("");
  };

  const calculateShipping = async () => {
    if (!postcode || postcode.replace(/\D/g, "").length !== 8) {
      setError("Por favor, insira um CEP válido");
      return;
    }

    setLoading(true);
    setError("");
    setShippingOptions([]);

    try {
      const response = await fetch("/api/shipping/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postcode: postcode.replace(/\D/g, ""),
          items: [
            {
              product_id: productId,
              quantity: quantity,
            },
          ],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao calcular frete");
      }

      setShippingOptions(data.methods || []);
    } catch (err) {
      setError(err.message || "Erro ao calcular frete");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      calculateShipping();
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <div className="flex items-center mb-3">
        <FiTruck className="mr-2 text-gray-600" />
        <h3 className="font-medium text-gray-900">Calcular Frete</h3>
      </div>

      <div className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="00000-000"
          value={postcode}
          onChange={handleCEPChange}
          onKeyPress={handleKeyPress}
          maxLength={9}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={calculateShipping}
          disabled={loading || !postcode}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {loading ? (
            <FiLoader className="animate-spin" />
          ) : (
            "Calcular"
          )}
        </button>
      </div>

      {error && (
        <div className="text-red-600 text-sm mb-3">
          {error}
        </div>
      )}

      {shippingOptions.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900 text-sm">
            Opções de entrega para {postcode}:
          </h4>
          {shippingOptions.map((option, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-3 bg-white rounded border"
            >
              <div>
                <div className="font-medium text-sm">{option.title}</div>
                <div className="text-xs text-gray-600">
                  {option.delivery_time}
                </div>
                {option.description && (
                  <div className="text-xs text-gray-500">
                    {option.description}
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="font-bold text-green-600">
                  {option.cost === 0 ? "Grátis" : `R$ ${option.cost.toFixed(2)}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 text-xs text-gray-500">
        <p>
          * Os prazos de entrega começam a contar a partir da confirmação do pagamento.
        </p>
        <p>
          * Para regiões remotas, o prazo pode ser estendido.
        </p>
      </div>
    </div>
  );
}

