"use client";
import { useCart } from "../context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { FiX, FiMinus, FiPlus, FiShoppingBag } from "react-icons/fi";

export default function Cart() {
  const {
    items,
    updateQuantity,
    removeItem,
    getTotalPrice,
    getTotalItems,
    isOpen,
    setIsOpen,
  } = useCart();

  const deliveryFee = 26.73;
  const freeShippingThreshold = 500;
  const subtotal = getTotalPrice();
  const isEligibleForFreeShipping = subtotal >= freeShippingThreshold;
  const remainingForFreeShipping = Math.max(
    0,
    freeShippingThreshold - subtotal
  );
  const progressPercentage = Math.min(
    100,
    (subtotal / freeShippingThreshold) * 100
  );
  const total = subtotal + (isEligibleForFreeShipping ? 0 : deliveryFee);

  const pixDiscountPercentage = 0.05;
  const pixDiscount = total * pixDiscountPercentage;
  const totalWithPixDiscount = total - pixDiscount;

  const handleUpdateQty = (item, delta) => {
    // Passa o ID do produto E as variações para identificar o item correto
    const newQty = item.quantity + delta;
    updateQuantity(item.id, newQty, item.selectedSize, item.selectedColor);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${
          isOpen
            ? "opacity-50 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}></div>

      {/* Sidebar do Carrinho */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        {/* Header do Carrinho */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">
            Seu Carrinho ({getTotalItems()})
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900">
            <FiX className="h-6 w-6" />
          </button>
        </div>

        {/* Barra de Progresso para Frete Grátis */}
        {items.length > 0 && (
          <div className="p-4 bg-gray-50 border-b">
            <div className="mb-2">
              {isEligibleForFreeShipping ? (
                <p className="text-green-600 font-semibold text-sm flex items-center">
                  <FiShoppingBag className="mr-2" />
                  Parabéns! Você ganhou frete grátis!
                </p>
              ) : (
                <p className="text-gray-700 text-sm">
                  Faltam{" "}
                  <span className="font-semibold text-blue-600">
                    R$ {remainingForFreeShipping.toFixed(2)}
                  </span>{" "}
                  para frete grátis
                </p>
              )}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  isEligibleForFreeShipping ? "bg-green-500" : "bg-blue-500"
                }`}
                style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </div>
        )}

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[calc(100%-120px)] text-gray-600 p-4">
            <FiShoppingBag className="text-6xl text-gray-300 mb-4" />
            <p className="text-lg mb-2 text-center">Seu carrinho está vazio</p>
            <p className="text-sm text-gray-500 mb-6 text-center">
              Adicione produtos incríveis e aproveite nossas ofertas!
            </p>
            <Link href="/products">
              <button
                onClick={onClose}
                className="bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors font-semibold">
                Continuar Comprando
              </button>
            </Link>
          </div>
        ) : (
          <>
            {/* Lista de Itens */}
            <div className="p-4 overflow-y-auto h-[calc(100%-380px)]">
              {items.map((item) => (
                <div
                  // A chave agora usa o cartItemId único
                  key={item.cartItemId}
                  className="flex items-center border-b py-4 last:border-b-0">
                  <Image
                    src={item.image || "/placeholder-image.png"}
                    alt={item.title}
                    width={80}
                    height={80}
                    className="object-cover rounded mr-4"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 text-sm">
                      {item.title}
                    </h3>
                    {/* Exibe tamanho e cor se estiverem presentes */}
                    {(item.selectedSize || item.selectedColor) && (
                      <p className="text-xs text-gray-600 mt-1">
                        {item.selectedSize && `Tamanho: ${item.selectedSize}`}
                        {item.selectedSize && item.selectedColor && " | "}
                        {item.selectedColor && `Cor: ${item.selectedColor}`}
                      </p>
                    )}
                    <p className="font-semibold text-gray-900 mt-1">
                      R$ {parseFloat(item.price).toFixed(2)}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center">
                        <button
                          onClick={() => handleUpdateQty(item, -1)}
                          disabled={item.quantity <= 1}
                          className="p-1 border rounded-full text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                          <FiMinus className="w-3 h-3" />
                        </button>
                        <span className="mx-3 text-gray-700 font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQty(item, 1)}
                          className="p-1 border rounded-full text-gray-600 hover:bg-gray-100">
                          <FiPlus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        // Passa o ID do produto E as variações para remover o item correto
                        onClick={() =>
                          removeItem(
                            item.id,
                            item.selectedSize,
                            item.selectedColor
                          )
                        }
                        className="text-red-500 hover:text-red-700 text-xs">
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Resumo do Carrinho e Botões */}
        {items.length > 0 && (
          <div className="absolute bottom-0 left-0 w-full p-4 bg-white border-t shadow-lg">
            <div className="flex justify-between text-gray-700 text-sm mb-2">
              <span>Subtotal:</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700 text-sm mb-4">
              <span>Frete:</span>
              <span
                className={
                  isEligibleForFreeShipping
                    ? "text-green-600 font-semibold"
                    : ""
                }>
                {isEligibleForFreeShipping
                  ? "Grátis"
                  : `R$ ${deliveryFee.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold mb-2">
              <span>Total:</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>

            <div className="bg-green-50 p-3 rounded-lg mb-4 text-center">
              <p className="text-green-800 text-sm font-semibold">
                Economize R$ {pixDiscount.toFixed(2)} pagando no Pix!
              </p>
              <p className="text-green-900 text-xl font-bold mt-1">
                Total no Pix: R$ {totalWithPixDiscount.toFixed(2)}
              </p>
            </div>

            <div className="flex flex-col space-y-3">
              <Link href="/checkout">
                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-lg text-white font-semibold transition-colors bg-blue-900 hover:bg-blue-800">
                  Finalizar Pedido
                </button>
              </Link>
              <Link href="/products">
                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-lg text-blue-900 border border-blue-900 hover:bg-blue-50 transition-colors font-semibold">
                  Continuar Comprando
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
