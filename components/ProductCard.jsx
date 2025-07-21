// components/ProductCard.jsx
"use client"; // Para usar hooks como Link

import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }) {
  // Converte o preço para número e formata
  const price = parseFloat(product.price).toFixed(2);
  const regularPrice = product.regular_price
    ? parseFloat(product.regular_price).toFixed(2)
    : null;
  const isOnSale =
    product.sale_price && product.sale_price < product.regular_price;

  // Usa a primeira imagem ou um placeholder
  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0].src
      : "/placeholder-image.png"; // Garanta que você tem um placeholder ou crie um

  // Categoria para exibir (primeira categoria)
  const categoryName =
    product.categories && product.categories.length > 0
      ? product.categories[0].name
      : "Sem categoria";

  return (
    <div className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <Link href={`/product/${product.id}`} className="block">
        <div className="w-full h-48 relative overflow-hidden bg-gray-100 flex items-center justify-center">
          <Image
            src={imageUrl}
            alt={product.name}
            fill // Ocupa todo o espaço do div pai
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw" // Otimização de imagem
            style={{ objectFit: "contain" }} // Garante que a imagem se ajuste sem cortar
            className="group-hover:scale-105 transition-transform duration-300 ease-in-out"
          />
        </div>
        <div className="p-4 flex flex-col items-start">
          <p className="text-xs font-medium text-gray-500 mb-1">
            {categoryName}
          </p>
          <h3 className="text-base font-semibold text-gray-800 line-clamp-2 min-h-[3rem]">
            {product.title}{" "}
            {/* <-- CORRIGIDO AQUI: de product.name para product.title */}
          </h3>
          <div className="flex items-baseline mt-2">
            {isOnSale ? (
              <>
                <p className="text-lg font-bold text-red-700">R$ {price}</p>
                <p className="text-sm text-gray-500 line-through ml-2">
                  R$ {regularPrice}
                </p>
              </>
            ) : (
              <p className="text-lg font-bold text-gray-900">R$ {price}</p>
            )}
          </div>
          {/* O botão "Comprar" ou "Adicionar" geralmente fica aqui, mas
              nesta página de listagem, é mais comum apenas o link para o produto.
              A lógica de "Adicionar ao Carrinho" com seleção de tamanho fica na página de detalhes.
          */}
        </div>
      </Link>
    </div>
  );
}
